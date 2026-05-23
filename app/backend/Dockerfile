FROM python:3.9-slim

WORKDIR /api

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt urllib3==1.26.6

COPY . .

EXPOSE 5000

CMD ["gunicorn","-w","4","-b","0.0.0.0:5000","app:app"]
