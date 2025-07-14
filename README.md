
#  מפות כוהנים

 **“מפות כוהנים”**!  
מטרת הפרויקט היא לתת מענה לצורכי שבט הכוהנים בתכנון מסלולים נגישים באזורים המכילים קברי ישראל (למשל: טבריה, חיפה, ירושלים ועוד).  
הפתרון מבוסס על [GraphHopper](https://github.com/graphhopper/graphhopper), עם תמיכה אונליין (ואופליין גם יהיה בעזרת  ה’).

---




## דרישות מקדימות

- [Node.js](https://nodejs.org/en)
  התקנה: https://nodejs.org/en  
- [Docker](github.com/IsraelHikingMap/graphhopper-docker-image-push)
(לאופליין, אופציונלי)

---

##  הוראות התקנה

1. **שכפול המאגר**  
   השתמשו בממשק למעלה והורידו את הפרוייקט

2. **השגת API Key**  
   רישום וקבלת מפתח ב-GraphHopper:  
   https://graphhopper.com

3. **הגדרת API Key**  
   בתוך התיקייה `server/` הכנסו לקובץ  `.env` ושנו את המפתח כפי שמופיע בדוגמה:
   ```
   GH_API_KEY=הכנס_כאן_את_המפתח_שקיבלת
   ```

4. **הרצת השרת**  
   ```bash
   node server/index.js
   ```
   לאחר ההפעלה, השרת זמין בכתובת:
   ```
   http://localhost:4000/
   ```

> **הערה**: לצורך הדגמה, הגרסה שהעלינו משתמשת ב-API אונליין של GraphHopper.

---

##  הפעלת שרת אופליין באמצעות Docker

כדי להפעיל API ללא הגבלות (ועם הפיצרים הנדרשים עבור הפרוייקט), ניתן להרים שרת מקומי של GraphHopper מתוך Docker:

1. **הורדת התמונה**  
   ```bash
   docker pull israelhikingmap/graphhopper
   ```
2. **הרצת הקונטיינר**  
   ```bash
   docker run -p 8989:8989 \
     israelhikingmap/graphhopper \
     --url https://download.geofabrik.de/asia/israel-and-palestine-latest.osm.pbf \
     --host 0.0.0.0
   ```

   

---

 ## אם אתם רוצים לסייע אשמח אם מיהו יאמן מפה לאזור מצומצם (למשל טבריה), ניתן לספק קובץ OSM קטן יותר (דורש לפחות 9–15 GB RAM גם אחרי כיווץ).

---

