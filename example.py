
import os
import pypdf

from dotenv import load_dotenv
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    raise ValueError("OPENROUTER_API_KEY is not set")


# 1. Load the local embedding model
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# 2. Create the vector store
vector_store = InMemoryVectorStore(embeddings)


# 3. Extract text from the PDF, preserving page metadata
def load_pdf_pages(file_path: str) -> list[Document]:
    reader = pypdf.PdfReader(file_path)

    return [
        Document(
            page_content=page.extract_text() or "",
            metadata={
                "source": file_path,
                "page": i + 1,
            },
        )
        for i, page in enumerate(reader.pages)
    ]


file_path = "data/nke-10k-2023.pdf"
docs = load_pdf_pages(file_path)

# 4. Split the document into overlapping chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    add_start_index=True,
)

all_splits = text_splitter.split_documents(docs)

# 5. Embed and index the chunks
vector_store.add_documents(documents=all_splits)

print(f"Indexed {len(all_splits)} chunks.")

# 6. Create the retriever
retriever = vector_store.as_retriever(
    search_kwargs={"k": 4}
)

# 7. Connect to an LLM through OpenRouter
llm = ChatOpenAI(
    model="apodex/apodex-1.1-mini:free",
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1",
    temperature=0.2,
    max_tokens=1000,
)

# 8. Define the RAG prompt
prompt = ChatPromptTemplate.from_template("""
You are a document question-answering assistant.

Answer the question using only the provided document excerpts.
If the excerpts do not contain enough information, say so.
Do not invent facts.

Include the source page numbers supporting your answer.

Document excerpts:
{context}

Question:
{question}
""")

# 9. Ask a question
question = "How many distribution centers does Nike have in the US?"

# Retrieve the relevant document chunks
retrieved_docs = retriever.invoke(question)

# Include source information with each chunk
context = "\n\n".join(
    f"Source: {doc.metadata['source']}, "
    f"Page: {doc.metadata['page']}\n"
    f"{doc.page_content}"
    for doc in retrieved_docs
)

# 10. Send the question and retrieved context to the LLM
messages = prompt.format_messages(
    context=context,
    question=question,
)

response = llm.invoke(messages)

print("Full response:")
print(repr(response))

print("\nResponse content:")
print(repr(response.content))

print("\nResponse metadata:")
print(response.response_metadata)

print("\nUsage metadata:")
print(response.usage_metadata)

# # 11. Print the answer
# print("\nAnswer:")
# print(response.content)

# print("\nRetrieved sources:")
# for doc in retrieved_docs:
#     print(
#         f"Page {doc.metadata['page']}: "
#         f"{doc.metadata['source']}"
#     )