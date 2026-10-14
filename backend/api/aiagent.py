from django.conf import settings
from langchain_openrouter import ChatOpenRouter
from langchain.agents import create_agent
from langchain.messages import HumanMessage
from langchain_huggingface import HuggingFaceEmbeddings
import pypdf
from langchain_core.documents import Document
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter

def load_pdf_pages(file_path):
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

def ask_openrouter(message, file_path):
    docs = load_pdf_pages(file_path)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )
    chunks = splitter.split_documents(docs)

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    
    vector_store = InMemoryVectorStore(embeddings)
    vector_store.add_documents(chunks)

    relevant_docs = vector_store.similarity_search(message, k=4)

    context = "\n\n".join(
        doc.page_content for doc in relevant_docs
    )

    model = ChatOpenRouter(
        model="lfm-2.5-2.6b:free",
        api_key=settings.OPENROUTER_API_KEY,
        temperature=0.2,
        max_tokens=1000,
    )

    user_message = f"""
    Document excerpts:
    {context}

    Question:
    {message}
    """
    
    agent = create_agent(
        model=model,
        system_prompt=(
            "You are a document question-answering assistant. "
            "Answer using only the supplied document excerpts. "
            "If the excerpts do not contain enough information, "
            "say so. Always provide a text answer."
        ),
    )
    
    response = agent.invoke({"messages": [HumanMessage(content=user_message)]})
    
    return response["messages"][-1].content
