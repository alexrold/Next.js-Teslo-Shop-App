# Next.js Teslo Shop App
  Parte del curso __Next.js: El framework de React para producción__

  * Instructor:
  __Fernando Herrera__
  __@fernando_her85__

  
## Acerca de este curso
SSR, SSG, CSR, ISR, Middlewares, Rutas dinámicas, Next API, Next Auth, Material UI, despliegues, Cookies y más.


* Para correr localmente, se requiere la base de datos.
```
  docker-compose up -d
```

* -d: __detached__


 ## MongoDB URL Local:
```
  mongodb://localhost:27017/teslodb
```

## Configurar variables de entorno
Renombrar el archivo: __.env.template__   a   __.env__


## Reconstruir los modulos de node y levantar Next
```
  yarn install
  yarn dev
```

## Generar base de datos con información de pruebas
Llamar:
```
  http://localhost:3000/api/seed
```
* Nota: Llamar al endpoint:  __http://localhost:3000/api/seed__ Eliminara por completo la data existente en la base de datos en modo __'development'__