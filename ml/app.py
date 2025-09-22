import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify

app = Flask(__name__)

def clean_text(text):
    text = text.lower()
    text = re.sub(r'\W+', ' ', text)  # Remove non-word characters
    return text

@app.route('/parse', methods=['POST'])
def parse_resume():
    data = request.json
    resume_content = clean_text(data.get('content', ''))
    job_descriptions = [clean_text(desc) for desc in data.get('job_descriptions', [])]
    jobs = data.get('jobs', [])

    if not job_descriptions or not jobs:
        return jsonify({'error': 'No job descriptions provided'}), 400

    vectorizer = TfidfVectorizer(stop_words='english')
    vectors = vectorizer.fit_transform([resume_content] + job_descriptions)
    resume_vec = vectors[0:1]
    job_vecs = vectors[1:]

    scores = cosine_similarity(resume_vec, job_vecs)[0]
    
    top_n = 5  # You can change this to any number
    top_indices = np.argsort(scores)[-top_n:][::-1]  # Get indices of top scores in descending order

    similar_jobs = []
    for idx in top_indices:
        job = jobs[idx].copy()  # To avoid modifying original object
        job['score'] = round(float(scores[idx]), 2)
        similar_jobs.append(job)

    return jsonify({'similar_jobs': similar_jobs})

if __name__ == '__main__':
    app.run(port=8000, debug=True)
