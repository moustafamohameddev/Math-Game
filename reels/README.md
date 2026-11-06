# Reels: أربع فيديوهات معمولة بـ HTML و JavaScript

إعادة بناء لأربع ريلز، فريم بفريم، باستخدام HTML و SVG و JavaScript، مع سيرفر Node.js صغير.
كل حاجة في الفيديو بقت كود: الرسم، والحركة، والتوقيتات، والألوان، والخطوط، والمؤثرات الصوتية.
مفيش ولا صورة ولا ملف صوت جاهز.

| المشهد | المقاس | المدة |
|---|---|---|
| `alhamdulillah`: الحمد لله، خط عربي متحرك | 1276×718 | 15.1 ث |
| `sabr`: الصبر، ساعة رملية | 720×1280 | 17.1 ث |
| `yudabbir`: يدبّر الأمر، مجموعة شمسية ثم بيت تحت المطر | 720×1280 | 13.9 ث |
| `istighfar`: الاستغفار، مطر ثم وردة ثم درع ثم سلّم | 720×1280 | 13.0 ث |

## فيديو كل يوم

في `daily/scripts.js` فيه سكريبتات جاهزة بنوعين: رسومات عامة، ونفس الأنواع الأربعة الأصلية بكلام جديد (`template: 'sabr' | 'yudabbir' | 'istighfar' | 'alhamdulillah'`).
السكريبتات بتمشي بالترتيب، سكريبت لكل يوم ابتداءً من تاريخ `start`، ولما تخلص بترجع من الأول.

```bash
npm run daily                        # يطلّع فيديو النهارده في output/daily/
npm run daily -- --date 2026-11-20   # فيديو يوم معيّن
npm run daily -- --id tawakkul       # سكريبت معيّن
npm run daily -- --all               # كل الفيديوهات مرة واحدة
npm run daily -- --list              # الجدول: كل يوم وفيديوهه
```

عشان تضيف فيديو جديد، ضيف عنصر في `daily/scripts.js`:

```js
{ id: 'sabr2', template: 'illustrated', theme: 'light',   // light | brown | navy
  title: 'الصبر', subtitle: 'Sabr · patience',
  beats: [                                                 // كل جملة ليها رسمة
    { ar: 'حين يطول *الانتظار*...', en: 'When the *waiting* grows long...', art: 'hourglass' },
  ],
  verse: { ar: 'إِنَّ اللَّهَ مَعَ *الصَّابِرِينَ*', en: '“Indeed, Allah is with the *patient*”', ref: 'سورة البقرة، آية ١٥٣' } }
```

- الكلمة اللي بين نجمتين `*كده*` بيتعمل لها هايلايت أو بتتلوّن.
- الرسومات المتاحة: `hourglass` `flower` `rain` `house` `stairs` `shield` `heart` `moon` `sun` `seed` `door` `lantern` `book` `tree` `orbit`
- التوقيتات والمؤثرات الصوتية والإضاءة بتتحسب لوحدها من النص.
- راجع نص كل آية أو حديث قبل ما تنشر.

## التشغيل

```bash
cd reels
npm start            # http://localhost:8080
```

مش محتاج `npm install` عشان تشغّل الفيديوهات، لأن السيرفر مكتوب بـ Node من غير أي مكتبات خارجية.

أزرار المشغّل: تشغيل وإيقاف (Space)، والتنقل فريم بفريم (← و →)، والتكرار، وملء الشاشة، واختيار الصوت.
تقدر كمان تفتح الفيديو عند لحظة معيّنة: `scenes/sabr/index.html?t=9.5`

## الصوت

- **🔊 مؤثرات** (الوضع الافتراضي): كل المؤثرات متولّدة بـ Web Audio في `engine/sfx.js`.
  حلّلت توقيت كل صوت في الأصل وطيفه وارتفاعه، وطلع إن صوت الـ ping موجة جيبية تردّدها 1400Hz، وإن معاه tick مع ظهور كل كلمة، ونفَس هوا (swell) مع تأثير الضوء، وتلألؤ، ومطر، وwhoosh.
- **🎵 الصوت الأصلي**: لو عندك الفيديو الأصلي، استخرج صوته على جهازك:
  ```bash
  npm run extract-audio -- path/to/video.mp4 sabr
  ```
  الملف بيتحفظ في `media/` ومش بيترفع على git. فيديو «الحمد لله» صوته الأصلي نشيد بصوت بشري، فالمشغّل بيختار له الصوت الأصلي تلقائياً لو الملف موجود.

## التصدير لفيديو MP4 (محتاج ffmpeg و Playwright)

```bash
npm install && npx playwright install chromium
npm run render -- all                       # output/<id>.mp4 بصوت المؤثرات
npm run render -- sabr --audio original     # بالصوت الأصلي
```

## المقارنة مع الأصل

```bash
npm run compare -- sabr path/to/original.mp4 --from 0 --to 17 --step 0.5
```

السكربت بيطلّع صورة في `compare/sabr.png` فيها لكل لحظة ثلاث لقطات جنب بعض: الأصل، والنسخة الجديدة، والفرق بينهم.

## الهيكل

```
engine/core.js      easing و keyframes و RNG ثابت و SVG و خطوط مرسومة باليد
engine/caption.js   نص كلمة بكلمة مع blur وخلفية هايلايت، ومقاسه مظبوط على عرض الأصل
engine/sfx.js       المؤثرات الصوتية الإجرائية والتصدير لـ WAV
engine/player.js    المشغّل: الخط الزمني والتحكم ومزامنة الصوت وواجهة التصدير
scenes/<id>/        كل مشهد: render(t) دالة نقية في الزمن، وفيها قائمة الأصوات
scripts/            render و compare و extract-audio
server.js           سيرفر ملفات ثابت (Node فقط)
```
