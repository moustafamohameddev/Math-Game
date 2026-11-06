/* سكريبتات الفيديوهات اليومية
 * ─────────────────────────────
 * كل عنصر = فيديو. الفيديو بتاع اليوم بيتحدد بالترتيب ابتداءً من `start`
 * (اليوم الأول = أول سكريبت، وبعد آخر سكريبت بيرجع للأول).
 *
 * illustrated (رسومات + كلام):
 *   theme   : 'light' | 'rose' (فاتح)  —  'brown' | 'navy' | 'olive' (غامق)
 *   title / subtitle
 *   beats   : جمل قصيرة، كل جملة عربي + إنجليزي + رسمة (art)
 *   verse   : الآية أو الذِّكر في الآخر + المرجع
 *   الكلمة بين نجمتين *كده* بتتلوّن/يتعمل لها هايلايت.
 *   الرسومات المتاحة: hourglass flower rain house stairs shield heart moon sun seed door lantern book tree orbit arch path scale
 *
 * sabr / yudabbir / istighfar / alhamdulillah: نفس شكل الفيديوهات الأصلية الأربعة، بنص جديد.
 *
 * alhamdulillah (خط عربي عرضي زي «الحمد لله»):
 *   base     : الجملة الأساسية، و ~ مكان المدّ (الكشيدة)
 *   sections : 4 أقسام، كل قسم كلماته بتظهر حوالين الجملة الأساسية
 *   ref      : المصدر
 *
 * brand: اسم حسابك، بيظهر على كل فيديو.
 *
 * راجع نص أي آية أو حديث قبل النشر. */
(function (root) {
  'use strict';
  const DAILY = {
    brand: 'mostafamohamed6003',   // اسم الحساب اللي بيظهر على كل فيديو
    start: '2026-11-06',
    scripts: [
      { id: 'tawakkul', template: 'illustrated', theme: 'brown', title: 'التوكل', subtitle: 'Tawakkul · trust in Allah',
        beats: [
          { ar: 'حين *تضيق* بك الطرق...', en: 'When the roads *narrow* for you...', art: 'rain' },
          { ar: 'وتتعب من كثرة *التفكير*...', en: 'and you are tired of *overthinking*...', art: 'rain' },
          { ar: 'سلّم أمرك *لله*...', en: 'hand your matter to *Allah*...', art: 'house' },
        ],
        verse: { ar: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ *فَهُوَ* *حَسْبُهُ*', en: '“And whoever relies upon Allah, He is *sufficient* for him”', ref: 'سورة الطلاق، آية ٣' } },

      { id: 'yusr', template: 'illustrated', theme: 'light', title: 'اليُسر', subtitle: 'Yusr · ease after hardship',
        beats: [
          { ar: 'مهما *اشتدّ* الضيق...', en: 'However *hard* it gets...', art: 'rain' },
          { ar: 'فالبذرة *تنبت* في الظلام...', en: 'a seed *grows* in the dark...', art: 'seed' },
          { ar: 'ثم *تزهر* في النور', en: 'then it *blooms* in the light', art: 'flower' },
        ],
        verse: { ar: 'فَإِنَّ مَعَ الْعُسْرِ *يُسْرًا*', en: '“For indeed, with hardship comes *ease*”', ref: 'سورة الشرح، آية ٥' } },

      { id: 'dhikr', template: 'illustrated', theme: 'navy', title: 'الذِّكر', subtitle: 'Dhikr · remembrance',
        beats: [
          { ar: 'قلبك *متعب*...', en: 'Your heart is *tired*...', art: 'heart' },
          { ar: 'ودواؤه *قريب*...', en: 'and its cure is *near*...', art: 'heart' },
          { ar: 'في *ذكر* الله', en: 'in the *remembrance* of Allah', art: 'heart' },
        ],
        verse: { ar: 'أَلَا بِذِكْرِ اللَّهِ *تَطْمَئِنُّ* الْقُلُوبُ', en: '“Verily, in the remembrance of Allah hearts find *rest*”', ref: 'سورة الرعد، آية ٢٨' } },

      { id: 'dua', template: 'illustrated', theme: 'navy', title: 'الدعاء', subtitle: 'Duʿāʾ · calling upon Him',
        beats: [
          { ar: 'في *جوف* الليل...', en: 'In the *depth* of the night...', art: 'moon' },
          { ar: 'ارفع يديك *بالدعاء*...', en: 'raise your hands in *duʿāʾ*...', art: 'moon' },
          { ar: 'فهو *يسمعك*', en: 'for He *hears* you', art: 'lantern' },
        ],
        verse: { ar: 'وَقَالَ رَبُّكُمُ ادْعُونِي *أَسْتَجِبْ* لَكُمْ', en: '“And your Lord said: Call upon Me, I will *respond* to you”', ref: 'سورة غافر، آية ٦٠' } },

      { id: 'qareeb', template: 'illustrated', theme: 'brown', title: 'إنّي قريب', subtitle: 'He is near',
        beats: [
          { ar: 'لست *وحدك*...', en: 'You are not *alone*...', art: 'moon' },
          { ar: 'هو *أقرب* مما تظن...', en: 'He is *closer* than you think...', art: 'moon' },
          { ar: 'فقط *ناده*', en: 'just *call* Him', art: 'moon' },
        ],
        verse: { ar: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي *قَرِيبٌ*', en: '“And when My servants ask you about Me, indeed I am *near*”', ref: 'سورة البقرة، آية ١٨٦' } },

      { id: 'rahma', template: 'illustrated', theme: 'navy', title: 'الرحمة', subtitle: 'Rahma · His mercy',
        beats: [
          { ar: 'مهما *أذنبت*...', en: 'No matter how much you *sinned*...', art: 'rain' },
          { ar: 'فرحمته *أوسع*...', en: 'His mercy is *wider*...', art: 'rain' },
          { ar: 'ارجع *إليه*', en: 'return to *Him*', art: 'flower' },
        ],
        verse: { ar: 'لَا تَقْنَطُوا مِن *رَّحْمَةِ* اللَّهِ', en: '“Do not despair of the *mercy* of Allah”', ref: 'سورة الزمر، آية ٥٣' } },

      { id: 'shukr', template: 'illustrated', theme: 'light', title: 'الشكر', subtitle: 'Shukr · gratitude',
        beats: [
          { ar: 'النعمة *الصغيرة*...', en: 'A *small* blessing...', art: 'seed' },
          { ar: 'إذا *شكرتها*...', en: 'when you are *grateful* for it...', art: 'seed' },
          { ar: '*تكبر* وتثمر', en: 'it *grows* and bears fruit', art: 'tree' },
        ],
        verse: { ar: 'لَئِن شَكَرْتُمْ *لَأَزِيدَنَّكُمْ*', en: '“If you are grateful, I will surely *increase* you”', ref: 'سورة إبراهيم، آية ٧' } },

      { id: 'la-tahzan', template: 'illustrated', theme: 'brown', title: 'لا تحزن', subtitle: 'Do not grieve',
        beats: [
          { ar: 'في *الليالي* الثقيلة...', en: 'On the *heavy* nights...', art: 'moon' },
          { ar: 'تذكّر أن معك *نورًا*...', en: 'remember there is a *light* with you...', art: 'lantern' },
          { ar: 'لا *ينطفئ*', en: 'that never *fades*', art: 'lantern' },
        ],
        verse: { ar: 'لَا تَحْزَنْ إِنَّ اللَّهَ *مَعَنَا*', en: '“Do not grieve; indeed Allah is *with us*”', ref: 'سورة التوبة، آية ٤٠' } },

      { id: 'makhraj', template: 'illustrated', theme: 'navy', title: 'المَخرج', subtitle: 'A way out',
        beats: [
          { ar: 'كل الأبواب *مغلقة*؟', en: 'Every door seems *closed*?', art: 'door' },
          { ar: 'اتّقِ الله *فيما* بينك وبينه...', en: 'be mindful of Allah in *private*...', art: 'door' },
          { ar: 'وسيفتح لك *بابًا*', en: 'and He will open a *door*', art: 'door' },
        ],
        verse: { ar: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ *مَخْرَجًا*', en: '“And whoever fears Allah, He will make for him a *way out*”', ref: 'سورة الطلاق، آية ٢' } },

      { id: 'rizq', template: 'illustrated', theme: 'light', title: 'الرزق', subtitle: 'Rizq · provision',
        beats: [
          { ar: 'رزقك *مكتوب*...', en: 'Your provision is *written*...', art: 'rain' },
          { ar: 'يأتيك في *وقته*...', en: 'it comes at its *time*...', art: 'seed' },
          { ar: 'من حيث لا *تدري*', en: 'from where you never *expected*', art: 'tree' },
        ],
        verse: { ar: 'وَيَرْزُقْهُ مِنْ حَيْثُ لَا *يَحْتَسِبُ*', en: '“And He provides for him from where he does not *expect*”', ref: 'سورة الطلاق، آية ٣' } },

      { id: 'khayr', template: 'illustrated', theme: 'light', title: 'الخِيَرة', subtitle: 'Khayr · hidden good',
        beats: [
          { ar: 'ما *تكرهه* اليوم...', en: 'What you *dislike* today...', art: 'rain' },
          { ar: 'قد يكون هو *المطر*...', en: 'might be the very *rain*...', art: 'rain' },
          { ar: 'الذي *يُنبت* فرحك', en: 'that *grows* your joy', art: 'flower' },
        ],
        verse: { ar: 'وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ *خَيْرٌ* لَّكُمْ', en: '“Perhaps you dislike a thing and it is *good* for you”', ref: 'سورة البقرة، آية ٢١٦' } },

      { id: 'wusaha', template: 'illustrated', theme: 'brown', title: 'على قدر الطاقة', subtitle: 'Never beyond your strength',
        beats: [
          { ar: 'الحِمل *ثقيل*...', en: 'The load is *heavy*...', art: 'stairs' },
          { ar: 'لكنك *أقوى* مما تظن...', en: 'but you are *stronger* than you think...', art: 'stairs' },
          { ar: 'خطوة *خطوة*', en: 'step by *step*', art: 'stairs' },
        ],
        verse: { ar: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا *وُسْعَهَا*', en: '“Allah does not burden a soul beyond its *capacity*”', ref: 'سورة البقرة، آية ٢٨٦' } },

      { id: 'aqrab', template: 'illustrated', theme: 'navy', title: 'أقرب إليك', subtitle: 'Closer than your vein',
        beats: [
          { ar: 'يعلم ما في *قلبك*...', en: 'He knows what is in your *heart*...', art: 'heart' },
          { ar: 'قبل أن *تنطق*...', en: 'before you *speak*...', art: 'heart' },
          { ar: 'فلا *تخف*', en: 'so do not *fear*', art: 'heart' },
        ],
        verse: { ar: 'وَنَحْنُ *أَقْرَبُ* إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ', en: '“And We are *closer* to him than his jugular vein”', ref: 'سورة ق، آية ١٦' } },

      { id: 'tarda', template: 'illustrated', theme: 'light', title: 'فترضى', subtitle: 'Until you are content',
        beats: [
          { ar: 'طال *الانتظار*؟', en: 'Has the *waiting* been long?', art: 'hourglass' },
          { ar: 'كل لحظة *محسوبة*...', en: 'every moment is *counted*...', art: 'hourglass' },
          { ar: 'والعطاء *قادم*', en: 'and the gift is *coming*', art: 'flower' },
        ],
        verse: { ar: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ *فَتَرْضَىٰ*', en: '“And your Lord will give you, and you will be *satisfied*”', ref: 'سورة الضحى، آية ٥' } },

      { id: 'udhkuruni', template: 'illustrated', theme: 'brown', title: 'اذكرني أذكرك', subtitle: 'Remember Me',
        beats: [
          { ar: 'تخيّل أن الله *يذكرك*...', en: 'Imagine Allah *remembering* you...', art: 'lantern' },
          { ar: 'بكلمة منك *فقط*...', en: 'for *just* a word from you...', art: 'lantern' },
          { ar: 'فلا *تغفل*', en: 'so do not be *heedless*', art: 'lantern' },
        ],
        verse: { ar: 'فَاذْكُرُونِي *أَذْكُرْكُمْ*', en: '“So remember Me; I will *remember* you”', ref: 'سورة البقرة، آية ١٥٢' } },

      { id: 'hasbuna', template: 'illustrated', theme: 'navy', title: 'حسبنا الله', subtitle: 'Allah is enough for us',
        beats: [
          { ar: 'إذا *اجتمعت* عليك الهموم...', en: 'When worries *gather* around you...', art: 'shield' },
          { ar: 'قلها *بيقين*...', en: 'say it with *certainty*...', art: 'shield' },
          { ar: 'وستكون في *حماه*', en: 'and you will be in His *protection*', art: 'shield' },
        ],
        verse: { ar: 'حَسْبُنَا اللَّهُ وَنِعْمَ *الْوَكِيلُ*', en: '“Allah is sufficient for us, and He is the best *Disposer of affairs*”', ref: 'سورة آل عمران، آية ١٧٣' } },

      { id: 'ghaffar', template: 'illustrated', theme: 'navy', title: 'الاستغفار', subtitle: 'Istighfar · seeking forgiveness',
        beats: [
          { ar: 'استغفر *ربك*...', en: 'Seek forgiveness from your *Lord*...', art: 'rain' },
          { ar: 'فيُرسل *الخير*...', en: 'and He sends down *goodness*...', art: 'rain' },
          { ar: 'كالمطر على *الأرض*', en: 'like rain upon the *earth*', art: 'flower' },
        ],
        verse: { ar: 'اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ *غَفَّارًا*', en: '“Ask forgiveness of your Lord; indeed He is ever *Forgiving*”', ref: 'سورة نوح، آية ١٠' } },

      { id: 'muhsinin', template: 'illustrated', theme: 'light', title: 'الإحسان', subtitle: 'Ihsan · excellence',
        beats: [
          { ar: 'ابتسامة، كلمة *طيبة*...', en: 'A smile, a *kind* word...', art: 'heart' },
          { ar: 'لا *تحقرنّ* شيئًا...', en: 'do not *belittle* anything...', art: 'tree' },
          { ar: 'فالله *يحبّ* المحسنين', en: 'Allah *loves* those who do good', art: 'tree' },
        ],
        verse: { ar: 'وَأَحْسِنُوا إِنَّ اللَّهَ *يُحِبُّ* الْمُحْسِنِينَ', en: '“And do good; indeed Allah *loves* the doers of good”', ref: 'سورة البقرة، آية ١٩٥' } },

      { id: 'rawh', template: 'illustrated', theme: 'brown', title: 'لا تيأس', subtitle: 'Never lose hope',
        beats: [
          { ar: 'مهما طال *الليل*...', en: 'However long the *night*...', art: 'moon' },
          { ar: 'فالفجر *آتٍ*...', en: 'the dawn is *coming*...', art: 'moon' },
          { ar: 'لا *محالة*', en: '*without* a doubt', art: 'sun' },
        ],
        verse: { ar: 'وَلَا تَيْأَسُوا مِن *رَّوْحِ* اللَّهِ', en: '“And do not despair of the *relief* of Allah”', ref: 'سورة يوسف، آية ٨٧' } },

      { id: 'walidayn', template: 'illustrated', theme: 'light', title: 'الوالدان', subtitle: 'Your parents',
        beats: [
          { ar: 'البيت *دافئ*...', en: 'Home is *warm*...', art: 'house' },
          { ar: 'لأن فيه *قلبين*...', en: 'because of two *hearts*...', art: 'house' },
          { ar: 'لا تنسَ *الدعاء* لهما', en: 'never forget to *pray* for them', art: 'heart' },
        ],
        verse: { ar: 'وَقُل رَّبِّ *ارْحَمْهُمَا* كَمَا رَبَّيَانِي صَغِيرًا', en: '“And say: My Lord, have *mercy* on them as they raised me when I was small”', ref: 'سورة الإسراء، آية ٢٤' } },

      { id: 'thabat', template: 'illustrated', theme: 'navy', title: 'الثبات', subtitle: 'Steadfastness',
        beats: [
          { ar: 'القلوب *تتقلّب*...', en: 'Hearts *turn*...', art: 'heart' },
          { ar: 'فاسأل الله *الثبات*...', en: 'so ask Allah for *steadfastness*...', art: 'lantern' },
          { ar: 'كل *يوم*', en: 'every *day*', art: 'lantern' },
        ],
        verse: { ar: 'رَبَّنَا لَا تُزِغْ *قُلُوبَنَا* بَعْدَ إِذْ هَدَيْتَنَا', en: '“Our Lord, let not our *hearts* deviate after You have guided us”', ref: 'سورة آل عمران، آية ٨' } },

      { id: 'ilm', template: 'illustrated', theme: 'brown', title: 'العِلم', subtitle: 'ʿIlm · knowledge',
        beats: [
          { ar: 'كل *صفحة* تقرؤها...', en: 'Every *page* you read...', art: 'book' },
          { ar: 'نور في *طريقك*...', en: 'is a light on your *path*...', art: 'book' },
          { ar: 'فاطلب *المزيد*', en: 'so ask for *more*', art: 'book' },
        ],
        verse: { ar: 'وَقُل رَّبِّ زِدْنِي *عِلْمًا*', en: '“And say: My Lord, increase me in *knowledge*”', ref: 'سورة طه، آية ١١٤' } },

      { id: 'sadr', template: 'illustrated', theme: 'light', title: 'اشرح لي صدري', subtitle: 'Expand my chest',
        beats: [
          { ar: 'قبل كل *بداية*...', en: 'Before every *beginning*...', art: 'stairs' },
          { ar: 'قبل كل *خطوة*...', en: 'before every *step*...', art: 'stairs' },
          { ar: 'ادعُ بها *بقلبك*', en: 'pray it with your *heart*', art: 'sun' },
        ],
        verse: { ar: 'رَبِّ اشْرَحْ لِي *صَدْرِي* وَيَسِّرْ لِي *أَمْرِي*', en: '“My Lord, expand for me my *chest* and ease for me my *task*”', ref: 'سورة طه، الآيتان ٢٥–٢٦' } },

      { id: 'hafiz', template: 'illustrated', theme: 'navy', title: 'الحفيظ', subtitle: 'The best guardian',
        beats: [
          { ar: 'تخاف على من *تحب*؟', en: 'Worried about those you *love*?', art: 'shield' },
          { ar: 'استودعهم *الله*...', en: 'entrust them to *Allah*...', art: 'house' },
          { ar: 'فهو *لا يضيّع* ودائعه', en: 'He *never loses* what is entrusted to Him', art: 'house' },
        ],
        verse: { ar: 'فَاللَّهُ خَيْرٌ *حَافِظًا*', en: '“But Allah is the best *guardian*”', ref: 'سورة يوسف، آية ٦٤' } },

      { id: 'latif', template: 'illustrated', theme: 'brown', title: 'اللطيف', subtitle: 'Al-Latif · the Subtle',
        beats: [
          { ar: 'لطفه *خفيّ*...', en: 'His kindness is *subtle*...', art: 'rain' },
          { ar: 'يأتيك من حيث *لا تدري*...', en: 'it reaches you in ways you *never knew*...', art: 'rain' },
          { ar: 'كقطرة *تُحيي* زهرة', en: 'like a drop that *revives* a flower', art: 'flower' },
        ],
        verse: { ar: 'اللَّهُ *لَطِيفٌ* بِعِبَادِهِ', en: '“Allah is *Subtle* with His servants”', ref: 'سورة الشورى، آية ١٩' } },

      { id: 'akhira', template: 'illustrated', theme: 'light', title: 'الآخرة', subtitle: 'What truly lasts',
        beats: [
          { ar: 'الأيام *تمضي*...', en: 'The days *pass*...', art: 'hourglass' },
          { ar: 'والدنيا *قصيرة*...', en: 'and this world is *short*...', art: 'hourglass' },
          { ar: 'فاعمل لما *يبقى*', en: 'so work for what *remains*', art: 'sun' },
        ],
        verse: { ar: 'وَالْآخِرَةُ *خَيْرٌ* وَأَبْقَىٰ', en: '“And the Hereafter is *better* and more lasting”', ref: 'سورة الأعلى، آية ١٧' } },

      // ───────────── نفس أنواع الفيديوهات الأصلية (نص جديد) ─────────────
      // template: 'sabr' | 'yudabbir' | 'istighfar' | 'alhamdulillah'  → نفس شكل وحركة الفيديو الأصلي بالظبط
      { id: 'yaqeen', template: 'sabr', title: 'اليقين', subtitle: 'Yaqeen · certainty',
        beats: [
          { ar: 'دعوت *كثيرًا*...', en: 'You have prayed *so much*...' },
          { ar: 'وتأخّرت *الإجابة*...', en: 'and the *answer* seems late...' },
        ],
        verse: { ar: 'فَاصْبِرْ إِنَّ وَعْدَ اللَّهِ *حَقٌّ*', en: '“So be patient; indeed the promise of Allah is *true*”', ref: 'سورة الروم، آية ٦٠' },
        closing: { ar: 'وسيأتيك *الخير* في وقته', en: 'and the *good* will come at its time' } },

      { id: 'maakum', template: 'yudabbir', title: 'وهو معكم',
        verse: { ar: 'وَهُوَ مَعَكُمْ أَيْنَ مَا *كُنتُمْ*', en: '“And He is with you *wherever* you are”', ref: 'سورة الحديد، آية ٤' },
        beats: [
          { ar: 'الذي يُمسك *السماء* بقدرته...', en: 'The One who holds the *sky* by His power...' },
          { ar: 'لا يغيب عنه *بيتك*...', en: 'never loses sight of your *home*...' },
          { ar: 'ولا تخفى عليه *دموعك*...', en: 'nor are your *tears* hidden from Him...' },
          { ar: 'فاطمئن... *إنه* معك', en: 'so be at peace... *He* is with you' },
        ] },

      { id: 'dhikr-journey', template: 'istighfar', title: 'الذِّكر', subtitle: 'Dhikr · remembrance',
        beats: [
          { ar: 'الذِّكر *يُحيي* القلب...', en: 'Dhikr *revives* the heart...' },
          { ar: '*ويحفظك*...', en: 'it *guards* you...' },
          { ar: '*ويرفعك*...', en: 'it *raises* you higher...' },
        ],
        closing: { ar: 'سبحان *الله* وبحمده سبحان الله العظيم', en: 'Glory be to *Allah* and His is the praise, glory be to Allah the Almighty' } },

      { id: 'tahlil', template: 'alhamdulillah', title: 'لا إله إلا الله',
        base: 'لَا إِلَ~هَ إِلَّا اللَّهُ',
        sections: [
          ['وَحْدَهُ', 'لَا شَرِيكَ لَهُ'],
          [{ t: 'لَهُ', slot: 0 }, { t: 'الْمُلْكُ', slot: 2 }, { t: 'وَلَهُ', slot: 3 }, { t: 'الْحَمْدُ', slot: 4 }],
          ['وَهُوَ عَلَى', 'كُلِّ', 'شَيْءٍ', 'قَدِيرٌ', 'فِي يَوْمٍ مِائَةَ مَرَّةٍ'],
          ['وَكُتِبَتْ لَهُ', 'مِائَةُ حَسَنَةٍ'],
        ],
        ref: 'متفق عليه' },

      // ───────────── الدفعة التانية ─────────────
      { id: 'salah', template: 'illustrated', theme: 'olive', title: 'الصلاة', subtitle: 'Salah · your daily rest',
        beats: [
          { ar: 'حين *تثقل* الدنيا...', en: 'When the world feels *heavy*...', art: 'rain' },
          { ar: 'قِف بين يديه *خمس* مرات...', en: 'stand before Him *five* times...', art: 'arch' },
          { ar: 'وارتَح في *سجودك*', en: 'and find rest in your *sujood*', art: 'arch' },
        ],
        verse: { ar: 'وَاسْتَعِينُوا بِالصَّبْرِ *وَالصَّلَاةِ*', en: '“And seek help through patience and *prayer*”', ref: 'سورة البقرة، آية ٤٥' } },

      { id: 'qadar', template: 'illustrated', theme: 'navy', title: 'القَدَر', subtitle: 'Qadar · it was written',
        beats: [
          { ar: 'ما *أصابك*...', en: 'What has *reached* you...', art: 'shield' },
          { ar: 'لم يكن *ليخطئك*...', en: 'was never going to *miss* you...', art: 'shield' },
          { ar: 'فاطمئن *واهدأ*', en: 'so be at *peace*', art: 'moon' },
        ],
        verse: { ar: 'قُل لَّن يُصِيبَنَا إِلَّا مَا *كَتَبَ* اللَّهُ لَنَا', en: '“Say: Nothing will befall us except what Allah has *decreed* for us”', ref: 'سورة التوبة، آية ٥١' } },

      { id: 'tawba', template: 'illustrated', theme: 'rose', title: 'التوبة', subtitle: 'Tawbah · coming back',
        beats: [
          { ar: 'مهما *ابتعدت*...', en: 'However *far* you have gone...', art: 'path' },
          { ar: 'الطريق *إليه* مفتوح...', en: 'the road to *Him* is open...', art: 'path' },
          { ar: 'عُد *الآن*', en: 'come back *now*', art: 'door' },
        ],
        verse: { ar: 'إِنَّ اللَّهَ يُحِبُّ *التَّوَّابِينَ*', en: '“Indeed, Allah loves those who *repent*”', ref: 'سورة البقرة، آية ٢٢٢' } },

      { id: 'sakina', template: 'illustrated', theme: 'olive', title: 'السكينة', subtitle: 'Sakinah · tranquility',
        beats: [
          { ar: 'وسط كل هذا *الضجيج*...', en: 'In the middle of all the *noise*...', art: 'rain' },
          { ar: 'هناك *سكينة*...', en: 'there is a *calm*...', art: 'lantern' },
          { ar: 'ينزلها الله في *قلبك*', en: 'that Allah sends into your *heart*', art: 'heart' },
        ],
        verse: { ar: 'هُوَ الَّذِي أَنزَلَ *السَّكِينَةَ* فِي قُلُوبِ الْمُؤْمِنِينَ', en: '“It is He who sent down *tranquility* into the hearts of the believers”', ref: 'سورة الفتح، آية ٤' } },

      { id: 'maiyya', template: 'illustrated', theme: 'light', title: 'معيّة الله', subtitle: 'Allah is with you',
        beats: [
          { ar: 'الصبر ليس *سهلًا*...', en: 'Patience is not *easy*...', art: 'hourglass' },
          { ar: 'لكنك لست *وحدك*...', en: 'but you are not *alone*...', art: 'hourglass' },
          { ar: 'الله *معك*', en: 'Allah is *with* you', art: 'sun' },
        ],
        verse: { ar: 'إِنَّ اللَّهَ مَعَ *الصَّابِرِينَ*', en: '“Indeed, Allah is with the *patient*”', ref: 'سورة البقرة، آية ١٥٣' } },

      { id: 'nur', template: 'illustrated', theme: 'navy', title: 'النور', subtitle: 'Nur · His light',
        beats: [
          { ar: 'في كل *ظلمة*...', en: 'In every *darkness*...', art: 'moon' },
          { ar: 'يكفيك *نوره*...', en: 'His *light* is enough...', art: 'lantern' },
          { ar: 'ليهديك *الطريق*', en: 'to show you the *way*', art: 'path' },
        ],
        verse: { ar: 'اللَّهُ *نُورُ* السَّمَاوَاتِ وَالْأَرْضِ', en: '“Allah is the *Light* of the heavens and the earth”', ref: 'سورة النور، آية ٣٥' } },

      { id: 'hidaya', template: 'illustrated', theme: 'brown', title: 'الهداية', subtitle: 'Hidayah · guidance',
        beats: [
          { ar: 'خطوة *صادقة*...', en: 'One *sincere* step...', art: 'stairs' },
          { ar: 'نحو *الله*...', en: 'towards *Allah*...', art: 'stairs' },
          { ar: 'تفتح لك *الطرق*', en: 'opens the *ways* for you', art: 'path' },
        ],
        verse: { ar: 'وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ *سُبُلَنَا*', en: '“Those who strive for Us, We will surely guide them to Our *ways*”', ref: 'سورة العنكبوت، آية ٦٩' } },

      { id: 'shifa', template: 'illustrated', theme: 'rose', title: 'الشفاء', subtitle: 'Shifa · healing',
        beats: [
          { ar: 'لكل *جرح*...', en: 'For every *wound*...', art: 'heart' },
          { ar: 'دواء في *كتابه*...', en: 'there is a cure in His *Book*...', art: 'book' },
          { ar: 'فاقرأ *بقلبك*', en: 'so read with your *heart*', art: 'book' },
        ],
        verse: { ar: 'وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ *شِفَاءٌ* وَرَحْمَةٌ لِّلْمُؤْمِنِينَ', en: '“And We send down in the Quran what is *healing* and mercy for the believers”', ref: 'سورة الإسراء، آية ٨٢' } },

      { id: 'ajr', template: 'illustrated', theme: 'olive', title: 'الأجر', subtitle: 'Nothing is lost',
        beats: [
          { ar: 'تعبك لا *يضيع*...', en: 'Your effort is never *lost*...', art: 'scale' },
          { ar: 'وكل *نية* طيبة...', en: 'and every good *intention*...', art: 'scale' },
          { ar: 'محفوظة *عنده*', en: 'is kept *with Him*', art: 'tree' },
        ],
        verse: { ar: 'إِنَّ اللَّهَ لَا يُضِيعُ *أَجْرَ* الْمُحْسِنِينَ', en: '“Indeed, Allah does not let the *reward* of the doers of good be lost”', ref: 'سورة التوبة، آية ١٢٠' } },

      { id: 'faraj', template: 'illustrated', theme: 'brown', title: 'الفَرَج', subtitle: 'Relief is coming',
        beats: [
          { ar: 'الشدّة *مؤقتة*...', en: 'Hardship is *temporary*...', art: 'rain' },
          { ar: 'والفرج *وعد*...', en: 'and relief is a *promise*...', art: 'rain' },
          { ar: 'من *الله*', en: 'from *Allah*', art: 'sun' },
        ],
        verse: { ar: 'سَيَجْعَلُ اللَّهُ بَعْدَ عُسْرٍ *يُسْرًا*', en: '“Allah will bring about *ease* after hardship”', ref: 'سورة الطلاق، آية ٧' } },

      { id: 'sadaqa', template: 'illustrated', theme: 'light', title: 'الصدقة', subtitle: 'Sadaqah · giving',
        beats: [
          { ar: 'ما *تعطيه*...', en: 'What you *give*...', art: 'seed' },
          { ar: 'لا *ينقص*...', en: 'is never *lost*...', art: 'seed' },
          { ar: 'بل *يُخلفه* الله', en: 'Allah *replaces* it', art: 'tree' },
        ],
        verse: { ar: 'وَمَا أَنفَقْتُم مِّن شَيْءٍ فَهُوَ *يُخْلِفُهُ*', en: '“Whatever you spend of anything, He will *replace* it”', ref: 'سورة سبأ، آية ٣٩' } },

      { id: 'wasiat', template: 'illustrated', theme: 'rose', title: 'رحمته وسعت', subtitle: 'His mercy embraces all',
        beats: [
          { ar: 'رحمته *تسع*...', en: 'His mercy *embraces*...', art: 'rain' },
          { ar: 'كل *شيء*...', en: 'every *thing*...', art: 'orbit' },
          { ar: 'وأنت *منهم*', en: 'and that includes *you*', art: 'heart' },
        ],
        verse: { ar: 'وَرَحْمَتِي *وَسِعَتْ* كُلَّ شَيْءٍ', en: '“And My mercy *encompasses* all things”', ref: 'سورة الأعراف، آية ١٥٦' } },

    ],
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = DAILY;
  else root.DAILY = DAILY;
})(typeof window !== 'undefined' ? window : globalThis);
