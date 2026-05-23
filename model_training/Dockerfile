FROM jupyter/datascience-notebook:x86_64-ubuntu-22.04
COPY ./requirements.txt /requirements.txt
RUN python -m pip install --upgrade pip
RUN pip install -r /requirements.txt
CMD [ "start-notebook.sh","--NotebookApp.token=" ]
