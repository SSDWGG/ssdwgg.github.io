# Nginx

Nginx est un serveur web souvent utilisé pour servir des sites statiques, faire du reverse proxy et gérer TLS, cache ou compression.

## Cas d’usage

- héberger un site statique ;
- proxy vers une API backend ;
- terminer HTTPS ;
- servir plusieurs domaines ;
- ajouter cache, gzip ou redirections.

## Commandes fréquentes

```bash
nginx -t
systemctl status nginx
systemctl reload nginx
systemctl restart nginx
```

## Exemple de site statique

```nginx
server {
  listen 80;
  server_name example.com;

  root /var/www/site;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## Bonnes pratiques

- testez toujours avec `nginx -t` avant de recharger ;
- gardez les fichiers de configuration courts ;
- séparez les domaines dans des fichiers dédiés ;
- surveillez les logs d’accès et d’erreur.

## Références

- Version chinoise : `/zh/tech-tools/nginx`

