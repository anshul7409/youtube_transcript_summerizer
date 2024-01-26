from flask import Flask, request
from youtube_transcript_api import YouTubeTranscriptApi
from transformers import pipeline
import textwrap

app = Flask(__name__)

@app.get('/summary')
def summary_api():
    url = request.args.get('url', '')
    print(url)
    video_id = url.split('=')[1]
    summary = get_summary(get_transcript(video_id))
    return summary


def get_transcript(video_id):
    transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
    transcript = ' '.join([d['text'] for d in transcript_list])
    return transcript



def get_summary(transcript):
    summariser = pipeline('summarization',model="facebook/bart-large-cnn")
    summary = ""
    t = 2
    # for i in range(0, (len(transcript)//1000)+1):
    #     summary_text = summariser(transcript[i*1000:(i+1)*1000])[0]['summary_text']
    #     summary = summary + summary_text + ' '
    if transcript != "":
        while t>0:
                chunks = textwrap.wrap(transcript, 800)
                res = summariser(chunks,max_length = 120,min_length = 30,do_sample = False)
                summary = ' '.join([summ['summary_text'] for summ in res])
                t-=1
    else:
        return "No Transcript Found"
    return summary

if __name__ == '__main__':
    app.run()