# 💰 אסטרטגיית תמחור: Outcome as a Service (OaaS)

**השינוי המנטלי:**
אנחנו לא מוכרים "תוכנה" ($50 לחודש). אנחנו מוכרים "עבודה שבוצעה".
זה המודל של 2026. הלקוח משלם רק כשהערך נוצר.

## המודל המוצע ל-Link OS

במקום מנוי חודשי קבוע ומשעמם, אנחנו מציעים:

### 1. Base + Success Fee (המודל ההיברידי)
*   **Base:** דמי רצינות נמוכים ($100-$300 לחודש) לכיסוי עלויות תשתית.
*   **Success:** תשלום על כל "פעולה בעלת ערך" (Outcome).

**דוגמאות ל-Outcomes:**
*   **סוכן מכירות:** $50 על כל פגישה שנקבעה ביומן (Qualified Meeting).
*   **סוכן שירות:** $1 על כל טיקט שנסגר ללא התערבות אדם.
*   **סוכן מחקר:** $20 על כל דוח מתחרים מלא.

### 2. למה זה מנצח את המתחרים?
*   **Salesforce/Zendesk:** גובים לפי "מושב" (Seat). אם יש לך 10 סוכנים, אתה משלם הון גם אם הם לא עושים כלום.
*   **Link OS:** אתה משלם רק כשהעסק שלך מרוויח. זה Zero Risk ללקוח.

## הטמעת המודל (Technical Impl)
אנחנו צריכים מערכת "מונה" (Metered Billing) בתוך ה-Core.
כל סוכן שמסיים משימה בהצלחה (סטטוס: Done) שולח אירוע ל-Stripe/Paddle.

> **ציטוט מסיירה (Sierra.ai):**
> "Outcome-based pricing aligns the vendor's incentives with the customer's. If the AI fails, the vendor doesn't get paid."
