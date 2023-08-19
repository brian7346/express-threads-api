Скачайте образ Docker для MongoDB с поддержкой replica set: 
```
docker pull prismagraphql/mongo-single-replica:5.0.3
```

Запустите контейнер с образом MongoDB и настройками replica set:

```
  docker run --name mongo \
       -p 27017:27017 \
       -e MONGO_INITDB_ROOT_USERNAME="monty" \
       -e MONGO_INITDB_ROOT_PASSWORD="pass" \
       -d prismagraphql/mongo-single-replica:5.0.3
```