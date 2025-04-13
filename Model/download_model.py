# download_model.py
from huggingface_hub import snapshot_download

model_path = snapshot_download(repo_id="AbheetSethi/Teledermatology_model")
print("Model saved at:", model_path)
