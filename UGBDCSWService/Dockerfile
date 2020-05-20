FROM geopython/pycsw:latest
 
COPY entrypoint.py /usr/local/bin/entrypoint.py 
COPY docker-stack-pycsw.cfg /etc/pycsw/pycsw.cfg

WORKDIR /home/pycsw

USER root
RUN mkdir -p /home/pycsw/datatemp
RUN chmod -R 777 /usr/lib/python3.5/site-packages
RUN chmod -R 777 /home/pycsw/datatemp
RUN pip3 install paho-mqtt executor

USER pycsw


EXPOSE 8000

ENTRYPOINT [\
  "python3", \
  "/usr/local/bin/entrypoint.py" \
]