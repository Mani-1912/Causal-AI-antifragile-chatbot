import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models.ml_model import train

if __name__ == '__main__':
    print("=" * 50)
    print("  Arogya — XGBoost Training Script")
    print("=" * 50)
    acc = train()
    print(f"\nDone! Accuracy: {acc * 100:.2f}%")
    print("You can now start the server with:  python app.py")
