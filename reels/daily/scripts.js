/* سكريبتات الفيديوهات اليومية
 * ─────────────────────────────
 * كل عنصر = فيديو. الفيديو بتاع اليوم بيتحدد بالترتيب ابتداءً من `start`
 * (اليوم الأول = أول سكريبت، وبعد آخر سكريبت بيرجع للأول).
 *
 * illustrated (رسومات + كلام):
 *   theme   : 'light' | 'brown' | 'navy'
 *   title / subtitle
 *   beats   : جمل قصيرة، كل جملة عربي + إنجليزي + رسمة (art)
 *   verse   : الآية أو الذِّكر في الآخر + المرجع
 *   الكلمة بين نجمتين *كده* بتتلوّن/يتعمل لها هايلايت.
 *   الرسومات المتاحة: hourglass flower rain house stairs shield heart moon sun seed door lantern book tree orbit
 *
 * calligraphy (خط عربي متحرك):
 *   base     : الجملة الأساسية، و ~ مكان المدّ (الكشيدة)
 *   sections : كل قسم سطرين/ثلاثة بيظهروا تحت الجملة الأساسية
 *   ref      : المصدر
 *
 * راجع نص أي آية أو حديث قبل النشر. */
(function (root) {
  'use strict';
  const DAILY = {
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

      { id: 'subhan-bihamdih', template: 'calligraphy', title: 'سبحان الله وبحمده',
        base: 'سُبْحَ~انَ اللَّهِ وَبِحَمْدِهِ',
        sections: [['عَدَدَ خَلْقِهِ', 'وَرِضَا نَفْسِهِ'], ['وَزِنَةَ عَرْشِهِ', 'وَمِدَادَ كَلِمَاتِهِ']],
        ref: 'رواه مسلم' },

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

      { id: 'la-hawla', template: 'calligraphy', title: 'لا حول ولا قوة إلا بالله',
        base: 'لَا حَ~وْلَ وَلَا قُوَّةَ',
        sections: [['إِلَّا بِاللَّهِ'], ['كَنْزٌ مِنْ كُنُوزِ الْجَنَّةِ']],
        ref: 'متفق عليه' },

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

      { id: 'baqiyat', template: 'calligraphy', title: 'أحب الكلام إلى الله',
        base: 'سُبْحَ~انَ اللَّهِ',
        sections: [['وَالْحَمْدُ لِلَّهِ', 'وَلَا إِلَهَ إِلَّا اللَّهُ'], ['وَاللَّهُ أَكْبَرُ', 'أَحَبُّ الْكَلَامِ إِلَى اللَّهِ']],
        ref: 'رواه مسلم' },

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

      { id: 'afw', template: 'calligraphy', title: 'اللهم إنك عفو',
        base: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ',
        sections: [['تُحِبُّ الْعَفْوَ'], ['فَاعْفُ عَنِّي']],
        ref: 'رواه الترمذي' },

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

      { id: 'muqallib', template: 'calligraphy', title: 'يا مقلب القلوب',
        base: 'يَا مُقَلِّبَ الْقُلُوبِ',
        sections: [['ثَبِّتْ قَلْبِي'], ['عَلَى دِينِكَ']],
        ref: 'رواه الترمذي' },

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

      { id: 'hasbiyallah', template: 'calligraphy', title: 'حسبي الله',
        base: 'حَسْبِيَ اللَّهُ',
        sections: [['لَا إِلَهَ إِلَّا هُوَ', 'عَلَيْهِ تَوَكَّلْتُ'], ['وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ']],
        ref: 'سورة التوبة، آية ١٢٩' },

      { id: 'akhira', template: 'illustrated', theme: 'light', title: 'الآخرة', subtitle: 'What truly lasts',
        beats: [
          { ar: 'الأيام *تمضي*...', en: 'The days *pass*...', art: 'hourglass' },
          { ar: 'والدنيا *قصيرة*...', en: 'and this world is *short*...', art: 'hourglass' },
          { ar: 'فاعمل لما *يبقى*', en: 'so work for what *remains*', art: 'sun' },
        ],
        verse: { ar: 'وَالْآخِرَةُ *خَيْرٌ* وَأَبْقَىٰ', en: '“And the Hereafter is *better* and more lasting”', ref: 'سورة الأعلى، آية ١٧' } },
    ],
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = DAILY;
  else root.DAILY = DAILY;
})(typeof window !== 'undefined' ? window : globalThis);
