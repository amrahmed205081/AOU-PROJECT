# اللغة هوية وانتماء

واجهة أمامية ثابتة لمشروع تخرج بكلية الإعلام. لا توجد قاعدة بيانات ولا لوحة إدارة.

## التشغيل

```bash
npm install
npm run dev
```

بناء الإنتاج:

```bash
npm run build
```

الموقع جاهز للنشر على Vercel. ملف `vercel.json` يوجّه المسارات إلى `index.html`.

## استبدال المحتوى

- المقالات: `src/data/articles.ts`
- الأقسام: `src/data/categories.ts`
- ترتيب الصفحة الرئيسية: `src/data/homepage.ts`
- الفيديوهات: `src/data/videos.ts` — ضع معرف يوتيوب حقيقي في `videoId`، واتركه `null` إن لم يتوفر الرابط.
- الشعار الرسمي كما هو: `public/logo/logo.jpg` و`src/assets/logo/logo.jpg`
- الصور: `public/images/` والمسارات داخل ملفات البيانات.
- روابط التواصل والحسابات: `src/data/siteSettings.ts`

المحتوى الحالي مادة معاينة، وليس مادة تحريرية معتمدة.
