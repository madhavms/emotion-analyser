def get_lexicon_string():
    with open("NRC-Emotion-Intensity-Lexicon-v1.txt", "r") as f:
        content = f.read()
    return content