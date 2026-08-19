# Die drei ??? – Akte

Web-App für die eigene Hörspielsammlung: alle Folgen durchsuchen, Detailinfos ansehen,
den Datenbestand von [dreimetadaten.de](https://dreimetadaten.de) aktualisieren, und per
Shootout-Duellen die eigene Lieblingsfolge (und den Lieblingsautor) herausfinden.

## Deployment auf dem Home-Server (Docker)

Das Repo ist `https://github.com/anbic8/DDF` (privat). Ablauf einmal komplett von
"Code committen" bis "läuft auf dem Server":

### 0. Auf dem Dev-PC: Code nach GitHub pushen

Passiert nicht automatisch – einmalig (und nach jeder weiteren Änderung) hier ausführen:

```bash
git add .
git commit -m "..."
git push
```

### 1. Auf dem Server: Ordner anlegen

Per SSH auf den Home-Server verbinden, dann z. B.:

```bash
mkdir -p ~/apps/ddf
cd ~/apps/ddf
```

(Pfad beliebig – wichtig ist nur, dass du ihn dir merkst, dort landet auch `./data`.)

### 2. GitHub-Zugriff auf dem Server einrichten

Da das Repo privat ist, braucht der Server eigene Zugangsdaten (dein lokal gespeichertes
Windows-Git-Login gilt dort nicht). Zwei Wege, **SSH-Deploy-Key ist empfohlen** (kein
Passwort/Token im Klartext, nur Lesezugriff für genau dieses Repo):

**Option A – SSH-Deploy-Key (empfohlen)**

```bash
ssh-keygen -t ed25519 -C "ddf-server" -f ~/.ssh/ddf_deploy_key -N ""
cat ~/.ssh/ddf_deploy_key.pub
```

Den ausgegebenen Public Key kopieren → auf GitHub zu
`https://github.com/anbic8/DDF/settings/keys` → **Add deploy key** → einfügen,
"Allow write access" **nicht** aktivieren (reicht zum Pullen) → speichern.

Danach dem Server sagen, dass er für dieses Repo den Key benutzen soll:

```bash
cat >> ~/.ssh/config <<'EOF'
Host github.com-ddf
  HostName github.com
  User git
  IdentityFile ~/.ssh/ddf_deploy_key
EOF
```

**Option B – Personal Access Token (einfacher, aber Token liegt in der Remote-URL)**

Auf `https://github.com/settings/tokens` einen Token mit `repo`-Scope erstellen, dann
beim Klonen direkt einbauen (Schritt 3, HTTPS-Variante unten).

### 3. Erstmaliges Klonen bzw. spätere Updates

**Erstes Mal** (im Ordner aus Schritt 1, dieser muss dafür leer sein):

```bash
# mit SSH-Deploy-Key (Option A):
git clone git@github.com-ddf:anbic8/DDF.git .

# ODER mit Personal Access Token (Option B):
git clone https://<DEIN_TOKEN>@github.com/anbic8/DDF.git .
```

**Bei jedem weiteren Update** (nachdem du auf dem Dev-PC gepusht hast):

```bash
cd ~/apps/ddf
git pull
```

### 4. Container bauen und starten

```bash
docker compose up -d --build
```

Läuft danach auf `http://<server>:3333`. Der Datenbestand (`serie.json`) sowie deine
Shootout-Bewertungen (`ratings.json`) liegen in `./data` und bleiben bei `git pull` +
Neubau des Containers erhalten (liegen außerhalb des Git-Repos, siehe `.gitignore`).

Nach jedem `git pull` muss `docker compose up -d --build` erneut laufen, damit der
neue Code auch im Image landet.

## Lokale Entwicklung

Zwei Terminals:

```bash
cd server && npm install && npm run dev     # Express-API auf Port 3000
cd client && npm install && npm run dev     # Vite-Dev-Server auf Port 5173 (proxyt /api zu 3000)
```

Dann `http://localhost:5173` öffnen.

Produktions-Build lokal testen:

```bash
cd client && npm run build
cd ../server && npm start   # liefert client/dist + API auf Port 3000
```

## Daten aktualisieren

Der "Aktualisieren"-Button im Header lädt `https://dreimetadaten.de/data/Serie.json` neu
herunter und ergänzt neue Folgen, ohne bestehende Shootout-Bewertungen zu verlieren.
