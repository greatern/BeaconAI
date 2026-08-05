"""
Pre-downloads and caches the AI pipeline's Hugging Face models.

The image classifier and summarizer download their model weights
(~900MB total) the first time they're used. Without this script, that
download would happen inline during someone's first real report
submission, making it slow. Run this once after installing dependencies
and before starting the server for the first time:

    python -m app.services.ai.warmup

After this completes, model weights are cached locally (usually under
~/.cache/huggingface) and every later run - including the actual
server - loads them from disk almost instantly, with no network call.

Needs a working internet connection to huggingface.co. If your network
blocks that domain, this will fail - the pipeline still works without
it (severity scoring always works locally; image classification and AI
summaries will simply stay empty on each report, see image_classifier.py
and summarizer.py for the fallback behavior).
"""

import os
import sys

# IMPORTANT: set this before importing image_classifier/summarizer.
# Those modules set an 8-second timeout meant to make a failed *live*
# report submission fail fast rather than hang. That's too short for
# an actual first-time download of a few hundred MB - this script
# needs real patience instead, since it's meant to be run once, not
# during a user-facing request.
os.environ["HF_HUB_DOWNLOAD_TIMEOUT"] = "120"


def main():
    print("Warming up Beacon AI's local AI pipeline...")
    print()

    print("[1/3] Severity model (scikit-learn, local, no download needed)...")
    from app.services.ai.severity_model import predict_severity

    score = predict_severity("pothole", "test")
    print(f"      OK - severity model ready (test prediction: {score})")
    print()

    print("[2/3] Image classifier (openai/clip-vit-base-patch32, ~600MB)...")
    print("      Downloading - this can take a few minutes on the first run.")
    from app.services.ai import image_classifier

    classifier = image_classifier._get_classifier()
    print("      OK - image classifier ready")
    print()

    print("[3/3] Summary generator (google/flan-t5-small, ~300MB)...")
    print("      Downloading - this can take a minute or two on the first run.")
    from app.services.ai import summarizer

    generator = summarizer._get_generator()
    print("      OK - summary generator ready")
    print()

    print("All models cached locally. The server will now load them instantly.")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print()
        print(f"Warm-up failed: {exc}")
        print()
        print("This usually means huggingface.co isn't reachable from this network.")
        print("The app still works without this - severity scoring always runs")
        print("locally, and image classification / AI summaries will just stay")
        print("empty on reports until this succeeds.")
        sys.exit(1)