# File: ai-service/app.py
from flask import Flask, request, jsonify
from transformers import pipeline
from deep_translator import GoogleTranslator

app = Flask(__name__)

# 1. Tải model (Chỉ chạy 1 lần khi bật server)
print("Đang tải model Hugging Face... Vui lòng đợi...")
emotion_classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    return_all_scores=True
)
print("-> Model đã sẵn sàng!")

@app.route('/analyze-emotion', methods=['POST'])
def analyze_emotion():
    try:
        data = request.json
        text_vietnamese = data.get('text', '')

        if not text_vietnamese:
            return jsonify({"error": "No text provided"}), 400

        # 2. Dịch sang tiếng Anh
        translated = GoogleTranslator(source='auto', target='en').translate(text_vietnamese)

        # 3. Phân tích cảm xúc
        results = emotion_classifier(translated)[0]

        # 4. Tìm cảm xúc mạnh nhất
        top_emotion = max(results, key=lambda x: x['score'])

        return jsonify({
            "original": text_vietnamese,
            "translated": translated,
            "top_emotion": top_emotion['label'], # Ví dụ: 'joy', 'sadness'
            "score": top_emotion['score'],
            "details": results
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Chạy server Python ở port 8000 để không đụng port 5000 của Node.js
    app.run(port=8000, debug=True)