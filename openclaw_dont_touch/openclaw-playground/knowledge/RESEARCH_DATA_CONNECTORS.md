# 🔌 Data Connectors: The Airbyte Strategy

**המטרה:** שהבוט ידע הכל על העסק (בלי להעתיק ידנית).

## למה Airbyte?
כי לכתוב אינטגרציה ל-Salesforce זה סיוט. Airbyte נותן לנו 300 אינטגרציות מוכנות.

## המודל: ETL for Agents
1.  **Extract:** שואבים מידע מכל המקורות (Gmail, Stripe, HubSpot).
2.  **Transform:** מנקים את המידע והופכים אותו לטקסט קריא ל-LLM (Chunks).
3.  **Load:** שומרים ב-Vector DB (Pinecone/pgvector).

## התוצאה
הבוט יכול לענות על: "כמה מכרנו החודש?" או "מי הלקוח הכי רווחי?"
בלי זה - הוא סתם צ'אטבוט טיפש. עם זה - הוא **Business OS**.
