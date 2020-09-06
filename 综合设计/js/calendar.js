+ function() {


    /**
     * 万年历支持查询的年份范围
     */
    var minYear = 1899; //最小年限
    var maxYear = 2100; //最大年限

    /**
     * 1899 - 2100 年的农历数据
     * 
     * 数据格式: 0x04bd8是5个16进制数,20bit的数,代表公历日期为 1900年01月31日,农历日期为1900年01月01日
     * 
     * 说明：农历中大月为30天,小月为29天
     * 
     * 前4位(即0): 表示当年润月的大小月,为1则润大月,为0则润小月。
     * 中间12位(即4bd): 每位代表一个月,为1则为大月,为0则为小月。12位表示1到12个月
     * 后4位(即8): 代表这一年的润月月份,为0则不润。首4位要与末4位搭配使用
     */
    var lunarInfo = [0x0ab50, //1899
        0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, //1900-1909
        0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, //1910-1919
        0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, //1920-1929
        0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, //1930-1939
        0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, //1940-1949
        0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, //1950-1959
        0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, //1960-1969
        0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, //1970-1979
        0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, //1980-1989
        0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, //1990-1999
        0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, //2000-2009
        0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, //2010-2019
        0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, //2020-2029
        0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, //2030-2039
        0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, //2040-2049
        0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, //2050-2059
        0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, //2060-2069
        0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, //2070-2079
        0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, //2080-2089
        0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, //2090-2099
        0x0d520
    ]; //2100

    // 二十四节气数据，节气点时间(单位是分钟)从0小寒起算
    var termInfo = [0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758];
    // 二十四节气
    var solarTerm = ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'];

    // 农历月
    var monthCN = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    // 农历日
    var dayCN = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', '卅一'];

    // 天干
    var heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    // 地支
    var earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    // 地支十二生肖
    var chinaZodiac = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

    // 星期
    var weekend = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

    // 国内传统节日
    var domesticFestival = {
        'd0101': '春节 ',
        'd0115': '元宵节',
        'd0202': '龙头节',
        'd0505': '端午节',
        'd0707': '七夕节',
        'd0715': '中元节',
        'd0815': '中秋节',
        'd0909': '重阳节',
        'd1001': '寒衣节',
        'd1015': '下元节',
        'd1208': '腊八节',
        'd1223': '小年'
    }

    // 国际节日
    var interFestival = {
        'i0202': '湿地日,1996',
        'i0308': '妇女节,1975',
        'i0315': '消费者权益日,1983',
        'i0401': '愚人节,1564',
        'i0422': '地球日,1990',
        'i0501': '劳动节,1889',
        'i0512': '护士节,1912',
        'i0518': '博物馆日,1977',
        'i0605': '环境日,1972',
        'i0623': '奥林匹克日,1948',
        'i1020': '骨质疏松日,1998',
        'i1117': '学生日,1942',
        'i1201': '艾滋病日,1988',
        'i0101': '元旦',
        'i0312': '植树节,1979',
        'i0504': '五四青年节,1939',
        'i0601': '儿童节,1950',
        'i0701': '建党节,1941',
        'i0801': '建军节,1933',
        'i0903': '抗战胜利日,1945',
        'i0910': '教师节,1985',
        'i1001': '国庆节,1949',
        'i1224': '平安夜',
        'i1225': '圣诞节',
        'i0214': '情人节',
        'i0520': '母亲节,1913',
        'i0630': '父亲节',
        'i1144': '感恩节'
    }

    /**********************************************
     * 变量声明优化(待优化)
     * 1、通过一个var声明多个变量
     * 2、通过字符串存储数据,不使用数组存储数据
     **********************************************/



    /**
     * 返回制定年月的日期视图
     * 
     * eg: var cal=getCalendar(2016,4);
     * 
     * 	28 29 30 31  1  2  3
     * 	 4  5  6  7  8  9 10
     * 	11 12 13 14 15 16 17
     * 	18 19 20 21 22 23 24
     * 	25 26 27 28 29 30 01
     *  
     *  说明: 示例中只显示了公历的日期,真实的返回内容要包括
     * 	农历,天干地支,国际节日,国内节日,节气,放假安排,黄历信息(每日宜忌)
     * 
     * @param {Number} y
     * @param {Number} m
     */
    function getCalendar(y, m) {
        var view = [];

        y = parseInt(y, 10);
        m = parseInt(m, 10);

        var pYear = m == 1 ? y - 1 : y;
        var pMonth = m == 1 ? 12 : m - 1;
        var nYear = m == 12 ? y + 1 : y;
        var nMonth = m == 12 ? 1 : m + 1;

        // 当月第一天星期几
        var w = getWeek(y, m, 1);

        // 获取当月天数
        var cDays = getMonthDays(y, m);
        // 获取上个月的天数
        var pDays = getMonthDays(pYear, pMonth);

        var pFill = w - 1; // 需要向前补充的天数
        var nFill = 7 - ((pFill + cDays) % 7 == 0 ? 7 : (pFill + cDays) % 7); // 需要向后补充的天数


        // 填充当月的公历日期
        for (var i = pDays - pFill + 1; i <= pDays; i++) {
            var week = getWeek(pYear, pMonth, i);
            view.push({
                solarCalendar: {
                    year: pYear,
                    month: pMonth,
                    day: i,
                    week: weekend[week - 1],
                    othermonth: true
                }
            });
        }
        for (var i = 1; i <= cDays; i++) {
            var week = getWeek(y, m, i);
            view.push({
                solarCalendar: {
                    year: y,
                    month: m,
                    day: i,
                    week: weekend[week - 1],
                    othermonth: false
                }
            });
        }
        for (var i = 1; i <= nFill; i++) {
            var week = getWeek(nYear, nMonth, i);
            view.push({
                solarCalendar: {
                    year: nYear,
                    month: nMonth,
                    day: i,
                    week: weekend[week - 1],
                    othermonth: true
                }
            });
        }

        // 遍历当月的每一天
        for (var i = 0; i < view.length; i++) {
            var elem = view[i];

            // 获取到某天的公历日期
            var year = elem.solarCalendar.year;
            var month = elem.solarCalendar.month;
            var day = elem.solarCalendar.day;

            // 获取某天的农历日期
            elem.lunarCalendar = getLunarCalendar(year, month, day);
            // 获取某天的天干地支
            elem.chinaEra = getChinaEra(year, month, day);
            // 获取某天的国际节日
            elem.interFestival = getInterFestival(year, month, day);
            // 获取某天的国内节日
            elem.domesticFestival = getDomesticFestival(elem.lunarCalendar.lunarYear, elem.lunarCalendar.lunarMonth, elem.lunarCalendar.lunarDay);
            // 获取某天的放假安排
            elem.legalHoliday = getLegalHoliday(year, month, day);
            // 获取弄天的黄历信息
            elem.almanac = getAlmanac(elem.lunarCalendar.lunarYear, elem.lunarCalendar.lunarMonth, elem.lunarCalendar.lunarDay);

        }

        return view;

    }

    /**
     * 
     * 根据日期获取某天的农历日期
     * 
     * 
     * 说明：通过当前日期和1899年1月10日的日期所差的天数,分别计算出当前日期对应的农历的年月日
     * 
     * @param {Number} y 年
     * @param {Number} m 月
     * @param {Number} d 日
     */
    function getLunarCalendar(y, m, d) {
        var res = {};

        var baseDate = new Date(1899, 1, 10);
        var curDate = new Date(y, m - 1, d);
        var offset = (curDate - baseDate) / 86400000; // 计算出当前日期到1899年1月10日所差的天数,(农历1899年1月1日)

        // 用offset依次减去每一年的天数,直至不够减,此时i就表示当前农历年份
        for (var i = minYear; i <= maxYear; i++) {
            var days = yearDays(i);
            if (offset - days < 1) {
                break;
            } else {
                offset -= days;
            }
        }
        // 查找对应的农历年
        res.year = i;
        res.lunarYear = i;
        // 此时offset为,当前日期到今年农历月份的天数,进而通过这个差值计算出对应的农历月份

        // 当年闰月的月份
        var leap = leapMonth(res.year);
        var isLeap = false;
        //设定当年是否有闰月
        if (leap > 0) {
            isLeap = true;
        }
        isLeapMonth = false;
        for (var i = 1; i <= 12; i++) {
            var days = null;

            //如果有闰月则减去闰月对应的天数
            if (isLeap && (i == leap + 1) && (isLeapMonth == false)) {
                isLeapMonth = true;
                i--;
                days = leapDays(res.year);

                // 如果没有闰月则减去正常月天数
            } else {
                isLeapMonth = false;
                days = monthDays(res.year, i);
            }
            // 如果offset-days小于0了说明,offset找到对应月份            
            if (offset - days < 0) break;
            offset = offset - days;
        }
        i = i == 13 ? 1 : i;
        res.month = (leap == i && isLeapMonth ? '润' : '') + monthCN[i - 1];
        res.day = dayCN[parseInt(offset)]; // 偏移量加1,得到对应的农历日期数. offset为当月1月1日的偏移量
        res.lunarMonth = i;
        res.lunarDay = offset + 1;
        return res;
    }
    /**
     * 
     * 根据农历日期获取某天的阳历日期
     * 
     * 
     * 说明：如果当年存在闰月的情况,会返回2个阳历日期
     * 
     * @param {Number} y 年
     * @param {Number} m 月
     * @param {Number} d 日
     */
    function getSolarCalendar(y, m, d) {

        // 获取阳历y年01月01日对应的农历时间
        var lunarCalendar = getLunarCalendar(y, 1, 1);
        // 对应的农历日期
        var lunarYear = lunarCalendar.lunarYear;
        var lunarMonth = lunarCalendar.lunarMonth;
        var lunarDay = lunarCalendar.lunarDay;


        // 计算这个农历日期到y-m-d的天数

        var leaveDays = yearDays(lunarYear) - offsetDays(lunarYear, lunarMonth, lunarDay);
        var offset = offsetDays(y, m, d);

        for (var i in offset) {
            offset[i] += leaveDays;
        }


        // 用这个天数+对应的阳历日期(y-01-01)计算出当前的阳历日期
        var res = [];
        for (var i in offset) {
            var dateDay = new Date(new Date(y, 0, 1).getTime() + offset[i] * 86400000);

            var y = dateDay.getFullYear();
            var m = dateDay.getMonth() + 1;
            var d = dateDay.getDate();

            res.push({
                year: y,
                month: m,
                day: d
            });
        }

        /**
         * 计算农历y年1月1日到农历y年m月d日的所差的天数
         * @param {Number} y
         * @param {Number} m
         * @param {Number} d
         */
        function offsetDays(y, m, d) {

            // 当年闰月的月份
            var leap = leapMonth(y);
            //设定当年是否有闰月
            var isLeap = false;
            if (leap > 0) {
                isLeap = true;
            }
            isLeapMonth = false;
            var offset = 0;
            for (var i = 1; i < m; i++) {

                //如果有闰月则减去闰月对应的天数
                if (isLeap && (i == leap + 1) && (isLeapMonth == false)) {
                    isLeapMonth = true;
                    i--;
                    days = leapDays(y);

                    // 如果没有闰月则减去正常月天数
                } else {
                    isLeapMonth = false;
                    days = monthDays(y, i);
                }

                offset += days;
            }
            offset += d;

            var res = [];
            res.push(offset);
            // 如果当前月就是闰月,就会存在2个offset
            if (m == leap) {
                res.push(offset + leapDays(y));
            }

            return res;
        }
        return res;
    }

    /*****************************************
     * 解析农历数据0x04bd8的相关函数
     *****************************************/

    /**
     * 返回y年农历的中闰月,如果y年没有闰月返回0
     * @param {Number} y 年
     */
    function leapMonth(y) {
        return (lunarInfo[y - 1899] & 0x0000f);
    }

    /**
     * 返回y年农历的中闰月的天数
     * @param {Number} y 年
     */
    function leapDays(y) {
        if (leapMonth(y)) {
            return ((lunarInfo[y - 1899] & 0x10000) ? 30 : 29);
        } else {
            return 0;
        }
    }

    /**
     * 返回y年农历的指定月份的天数
     * @param {Number} y 年
     */
    function monthDays(y, m) {
        return ((lunarInfo[y - 1899] & (0x10000 >> m)) ? 30 : 29);
    }
    /**
     * 返回y年农历的总天数
     * @param {Number} y 年
     */
    function yearDays(y) {
        var i, sum = 0;
        for (i = 0x08000; i > 0x00008; i >>= 1) {
            sum += (lunarInfo[y - 1899] & i) ? 30 : 29;
        }
        return (sum + leapDays(y)); // y年的天数再加上当年闰月的天数
    }


    /**
     * 
     * 根据日期获取某天的天干地支
     * 
     * @param {Number} y 年
     * @param {Number} m 月
     * @param {Number} d 日
     */
    function getChinaEra(y, m, d) {
        var res = {};

        var firstTerm = getTerm(y, (m - 1) * 2); //某月第一个节气开始日期
        var gzYear = (m > 2 || m == 2 && d >= getTerm(y, 2)) ? y + 1 : y; //干支所在年份
        var gzMonth = d >= firstTerm ? m : m - 1; //干支所在月份（以节气为界）


        res.year = getEraYear(gzYear);
        res.month = getEraMonth(y, gzMonth);
        res.day = getEraDay(y, m, d);

        res.zodiac = getYearZodiac(gzYear);
        res.term = getYearTerm(y, m, d);




        /*****************************************
         * 计算天干地支节气相关函数
         *****************************************/
        /**
         * num 60进制中的位置(把60个天干地支编码成60进制的数)
         * @param {Number} num
         */
        function calculate(num) {
            return heavenlyStems[num % 10] + earthlyBranches[num % 12]
        }
        /**
         * 获取干支纪年
         * @param {Number} y 年
         */
        function getEraYear(y) {
            return calculate(y - 1900 + 35); // 1900年前一年为乙亥年,60进制编码为35
        }
        /**
         * 获取干支纪月
         * @param {Number} y 年
         * @param {Number} m 月
         */
        function getEraMonth(y, m) {
            return calculate((y - 1900) * 12 + m + 12); // 1900年1月小寒以前为丙子月，在60进制中排12
        }
        /**
         * 获取干支纪日
         * @param {Number} y 年
         * @param {Number} m 月
         * @param {Number} d 日
         */
        function getEraDay(y, m, d) {
            return calculate(Math.ceil((new Date(y, m - 1, d) - new Date(1900, 0, 1)) / 86400000 + 10)); // 甲戌
        }
        /**
         * 获取生肖
         * @param {Number} y 干支所在年(默认以立春前的公历年作为基数)
         */
        function getYearZodiac(y) {
            var num = y - 1900 + 35; //参考干支纪年的计算，生肖对应地支
            return chinaZodiac[num % 12];
        }
        /**
         * 某年的第n个节气为几日
         * 地球公转时间:31556925974.7 毫秒
         * 由于农历24节气交节时刻采用近似算法,可能存在少量误差(30分钟内)
         * 1900年的正小寒点：01-06 02:03:57,1900年为基准点
         * 
         * @param {Number} y 公历年
         * @param {Number} n 第几个节气，从0小寒起算
         * 
         */
        function getTerm(y, n) {
            var offDate = new Date((31556925974.7 * (y - 1900) + termInfo[n] * 60000) + Date.UTC(1900, 0, 6, 2, 3, 57));
            return (offDate.getUTCDate());
        }
        /**
         * 获取公历年一年的二十四节气
         * 返回节气中文名
         */
        function getYearTerm(y, m, d) {
            var res = null;
            var month = 0;
            for (var i = 0; i < 24; i++) {
                var day = getTerm(y, i);
                if (i % 2 == 0) month++
                    if (month == m && day == d) {
                        res = solarTerm[i];
                    }
            }
            return res;
        }
        return res;
    }

    /**
     * 
     * 根据日期获取某天的国际节日
     * 
     * @param {Number} y 年
     * @param {Number} m 月
     * @param {Number} d 日
     */
    function getInterFestival(y, m, d) {
        m = m < 10 ? '0' + m : m;
        d = d < 10 ? '0' + d : d;

        var fes = interFestival['i' + m + d];
        if (fes) {
            if (fes.split(',').length > 1) {
                var by = fes.split(',')[1];
                return y >= by ? fes.split(',')[0] : null;
            } else {
                return fes;
            }
        } else {
            return null;
        }

    }
    /**
     * 
     * 根据日期获取某天的国内节日
     * 
     * @param {Number} y 年
     * @param {Number} m 月
     * @param {Number} d 日
     */
    function getDomesticFestival(y, m, d) {
        m = m < 10 ? '0' + m : m;
        d = d < 10 ? '0' + d : d;
        return domesticFestival['d' + m + d] ? domesticFestival['d' + m + d] : null;
    }
    /**
     * 
     * 根据日期获取某天的放假安排
     * 
     * @param {Number} y 年
     * @param {Number} m 月
     * @param {Number} d 日
     */
    function getLegalHoliday(y, m, d) {
        m = m < 10 ? '0' + m : m;
        d = d < 10 ? '0' + d : d;

        var Calendar = window.Calendar;
        if (Calendar.Holiday && Calendar.Holiday['y' + y]) { //该年已有黄历数据
            return Calendar.Holiday['y' + y]['d' + m + d] ? Calendar.Holiday['y' + y]['d' + m + d] : null;
        }

    }
    /**
     * 
     * 根据日期获取某天的黄历信息
     * 
     * @param {Number} y 年
     * @param {Number} m 月
     * @param {Number} d 日
     */
    function getAlmanac(y, m, d) {
        m = m < 10 ? '0' + m : m;
        d = d < 10 ? '0' + d : d;

        var Calendar = window.Calendar;
        if (Calendar.HuangLi && Calendar.HuangLi['y' + y]) { //该年已有黄历数据
            return Calendar.HuangLi['y' + y]['d' + m + d] ? Calendar.HuangLi['y' + y]['d' + m + d] : null;
        }
    }
    /**
     * 获取某月的天数
     * @param {Number} y 年
     * @param {Number} m 月
     */
    function getMonthDays(y, m) {
        var monthDays = [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return monthDays[m - 1];
    };
    /**
     * 根据日期获取某天的星期数
     * 
     * eg: var w=getWeek(2016,4,7); // w=1; 返回值范围 1-7
     * 
     * @param {Number} y 年
     * @param {Number} m 月
     * @param {Number} d 日
     */
    function getWeek(y, m, d) {
        return new Date(y, m - 1, d).getDay() == 0 ? 7 : new Date(y, m - 1, d).getDay(); // 注意:JavaScript月份范围是0-11
    }
    /**
     * 判断一个年份是闰年还是平年
     * 
     * eg: var r=isLeapYear(2016); // r=true; 
     * 
     * @param {Number} y 年
     */
    function isLeap(y) {
        return ((y % 4 == 0 && y % 100 != 0) || (y % 400 == 0));
    }
    /**
     * 用于测试和调试使用,打印日历
     * @param {Number} y
     * @param {Number} m
     */
    function debugCalendar(y, m) {

        var view = getCalendar(y, m);
        var i = 0;
        console.log('\t%c公历 ', 'color:red');
        console.log('\t%s\t%s\t%s\t%s\t%s\t%s\t%s', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日');
        while (i < view.length) {
            if (i % 7 == 0) {
                console.log('\t%s\t\t%s\t\t%s\t\t%s\t\t%s\t\t%s\t\t%s', view[i++].solarCalendar.day, view[i++].solarCalendar.day, view[i++].solarCalendar.day, view[i++].solarCalendar.day, view[i++].solarCalendar.day, view[i++].solarCalendar.day, view[i++].solarCalendar.day);
            }
        }
        var i = 0;
        console.log('\t%c农历', 'color:red');
        console.log('\t%s\t%s\t%s\t%s\t%s\t%s\t%s', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日');
        while (i < view.length) {
            if (i % 7 == 0) {
                console.log('\t%s\t\t%s\t\t%s\t\t%s\t\t%s\t\t%s\t\t%s', view[i++].lunarCalendar.day, view[i++].lunarCalendar.day, view[i++].lunarCalendar.day, view[i++].lunarCalendar.day, view[i++].lunarCalendar.day, view[i++].lunarCalendar.day, view[i++].lunarCalendar.day);
            }
        }
        var i = 0;
        console.log('\t%c天干地支', 'color:red');
        console.log('\t%s\t%s\t%s\t%s\t%s\t%s\t%s', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日');
        while (i < view.length) {
            if (i % 7 == 0) {
                console.log('\t%s\t\t%s\t\t%s\t\t%s\t\t%s\t\t%s\t\t%s', view[i++].chinaEra.day, view[i++].chinaEra.day, view[i++].chinaEra.day, view[i++].chinaEra.day, view[i++].chinaEra.day, view[i++].chinaEra.day, view[i++].chinaEra.day);
            }
        }
    }
    // 加载依赖库文件
    function loadCalendarLib(y, callback) {

        var today = new Date();
        var ty = today.getFullYear();

        var y = parseInt(y, 10);
        var libs = [];

        for (var i = y - 1; i <= y + 1; i++) {
            if (!Calendar.Holiday || !Calendar.Holiday['y' + i]) {
                if (i <= ty) {
                    libs.push('lib/wt' + i + '.js');
                }
            }
            if (!Calendar.HuangLi || !Calendar.HuangLi['y' + i]) {
                libs.push('lib/hl' + i + '.js');
            }
        }
        DOM.getScript(libs, callback);
    }

    // 定义全局命名空间Calendar
    window.Calendar = window.Calendar || {};

    Calendar.getCalendar = getCalendar; // 根据传入的年月,返回对应的月份的视图
    Calendar.getSolarCalendar = getSolarCalendar; // 根据农历日期获取到公历日期
    Calendar.getLunarCalendar = getLunarCalendar; // 根据农历日期获取到公历日期
    Calendar.debugCalendar = debugCalendar; // 根据公历历日期获取到农历日期
    Calendar.loadCalendarLib = loadCalendarLib; // 加载lib文件(黄历和放假安排)



    // 支持AMD和CommonJS规范...


}();


+

function() {

    // 事件对象
    var events = {
        on: function(type, handler) {
            DOM.each(this.dom, function(element) {
                // firefox google chrome
                if (element.addEventListener) {
                    element.addEventListener(type, handler, false);
                    // ie
                } else if (element.attachEvent) {
                    element.attachEvent('on' + type, handler);
                    // other
                } else {
                    element['on' + type] = handler;
                }
            });
        },
        off: function(type, handler) {
            DOM.each(this.dom, function(element) {
                // firefox google chrome
                if (element.removeEventListener) {
                    element.removeEventListener(type, handler, false);
                    // ie
                } else if (element.detachEvent) {
                    element.detachEvent('on' + type, handler);
                    // other
                } else {
                    element['on' + type] = null;
                }
            });
        }

    }



    /****************************
    // 实现细节
    /***************************/

    /**
     * 拓展模板功能
     * @param {String} html
     * @param {Object} options
     */
    function template(html, options) {

        // 用于缓存编译过的模板
        var cache = {};

        function compile(html, options) {

            var regExp = /<%([^%>]+)%>/g;
            var regVar = /<%=([^%>]+)%>/g;

            var res = null;
            if (!/\W/.test(html)) {
                res = cache[html] || compile(document.getElementById(html).innerHTML, options);
            } else {
                var tmpl = 'var p=[];' +
                    'with(obj||{}){p.push(\'' +
                    html.replace(/\\/g, '\\\\')
                    .replace(/'/g, "\\'")
                    .replace(regVar, function(match, code) {
                        return "'," + code.replace(/\\'/g, "'") + ",'";
                    })
                    .replace(regExp || null, function(match, code) {
                        return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, ' ') + "p.push('";
                    })
                    .replace(/\r/g, '\\r')
                    .replace(/\n/g, '\\n')
                    .replace(/\t/g, '\\t') +
                    "');}return p.join('');";

                res = new Function('obj', tmpl)(options);
            }
            return res;
        }
        return compile(html, options);
    }
    /**
     * 
     * 拓展元素选择器
     * @param {String} sel 	         选择字符串
     * @param {String} context 上线文环境
     */
    function selector(sel, context) {

        context = context || document;

        var dom = [];

        if (!(typeof sel == 'string')) {
            dom.push(sel);
            return dom;
        }
        var doms = context.querySelectorAll(sel);
        for (var i = 0; i < doms.length; i++) {
            dom.push(doms[i]);
        }
        return dom;
    }


    // 遍历集合元素
    function each(obj, callback) {
        for (var e in obj) {
            callback(obj[e], e);
        }
    }
    // 更新某个元素中的html内容
    function html(html) {

        if (html) {
            DOM.each(this.dom, function(e) {
                e.innerHTML = html;
            });
        } else {
            var res = [];
            DOM.each(this.dom, function(e) {
                res.push(e.innerHTML);
            });
            return res.length == 1 ? res[0] : res;
        }

    }
    // 判断是否拥有某个类名
    function hasClass(cls, e) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        e = e || this.dom[0];
        return e.className ? reg.test(e.className) : false;
    }

    // 添加类名
    function addClass(cls) {
        DOM.each(this.dom, function(e) {
            if (!hasClass(cls, e)) {
                e.className += " " + cls;
            }
        });
    }
    // 删除类
    function removeClass(cls) {
        DOM.each(this.dom, function(e) {
            if (hasClass(cls, e)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                e.className = e.className.replace(reg, ' ');
            }
        });
    }
    // 显示
    function show() {
        DOM.each(this.dom, function(e) {
            try {
                e.style.visibility = 'visible';
                e.style.display = 'inherit';
            } catch (err) {}
        });
    }
    // 隐藏
    function hide() {
        DOM.each(this.dom, function(e) {
            try {
                e.style.visibility = 'hidden';
                e.style.display = 'none';
            } catch (err) {}
        });
    }
    // 切换
    function toggle() {
        DOM.each(this.dom, function(e) {
            try {
                var visibility = e.style.visibility == 'hidden' ? 'visible' : 'hidden';
                var display = e.style.display == 'none' || e.style.display == '' ? 'inherit' : 'none';
                e.style.visibility = visibility;
                e.style.display = display;
            } catch (err) {}
        });
    }

    function attr(name, value) {
        if (value) {
            DOM.each(this.dom, function(e) {
                e.setAttribute(name, value);
            });
        } else {
            var res = [];
            DOM.each(this.dom, function(e) {
                res.push(e.getAttribute(name));
            });
            return res.length == 1 ? res[0] : res;
        }
    }

    // 动态加载JS
    function getScript(urls, callback) {

        var head = document.getElementsByTagName('head')[0];
        urls = typeof urls === 'string' ? [urls] : urls.concat();

        if (urls.length <= 0) {
            callback();
        }

        for (var i in urls) {
            var js = document.createElement('script');
            js.setAttribute('type', 'text/javascript');
            js.setAttribute('src', urls[i]);
            head.appendChild(js);
            if (document.all) { //IE
                js.onreadystatechange = function() {
                    if (js.readyState == 'loaded' || js.readyState == 'complete') {

                        (i == urls.length - 1) && callback();
                    }
                }
                js.onerror = function() {
                    (i == urls.length - 1) && callback();
                }
            } else {
                js.onload = function() {
                    (i == urls.length - 1) && callback();
                }
                js.onerror = function() {
                    (i == urls.length - 1) && callback();
                }
            }


        }
    }
    window.DOM = window.DOM || function(seletor, context) {
        if (this instanceof DOM) {
            this.dom = selector(seletor, context);
            return this;
        } else {
            return new DOM(seletor, context);
        }
    }

    /****************************
    // 拓展静态方法
    /***************************/
    // 遍历对象和数组
    DOM.each = each;
    // 模板
    DOM.template = template;
    // 动态加载JS
    DOM.getScript = getScript;
    /****************************
    // 拓展共有方法
    /***************************/
    DOM.prototype.html = html;
    DOM.prototype.addClass = addClass;
    DOM.prototype.removeClass = removeClass;
    DOM.prototype.hasClass = hasClass;
    DOM.prototype.show = show;
    DOM.prototype.hide = hide;
    DOM.prototype.toggle = toggle;
    DOM.prototype.attr = attr;
    /****************************
    // 拓展事件对象
    /***************************/
    DOM.each(events, function(value, key) {
        DOM.prototype[key] = value;
    });
}();


+

function(cal, $) {

    // 日历对象
    var Calendar = cal || window.Calendar;

    /**
     * 日历详情
     * @param {Number} y 年
     * @param {Number} m 月
     */
    function calendarHTML(y, m) {

        var month = Calendar.getCalendar(y, m);


        // 日历主体HTML片段
        var html = '';
        html += '<table class="op-calendar-new-table <%=tableSix%>">';
        html += '<tbody>';
        html += '<tr>';
        html += '<th>一</th>';
        html += '<th>二</th>';
        html += '<th>三</th>';
        html += '<th>四</th>';
        html += '<th>五</th>';
        html += '<th class="op-calendar-new-table-weekend">六</th>';
        html += '<th class="op-calendar-new-table-weekend">日</th>';
        html += '</tr>';

        // 日历天HTML片段
        var dtmpl = '';
        dtmpl += '<td><div class="op-calendar-new-relative">';
        dtmpl += '<a class="<%=dateClass%>" href="javascript:;" date="<%=dateDay%>" data-othermonth="<%=othermonth%>">';
        dtmpl += '<span class="op-calendar-new-daynumber"><%=solarDay%></span>';
        dtmpl += '<span class="op-calendar-new-table-almanac"><%=lunarDay%></span>';
        dtmpl += '<%if(rest)%><span class="op-calendar-new-table-holiday-sign">休</span> </a>';
        dtmpl += '</div></td>';

        /**
         * 
         * 正常：op-calendar-new-relative
         * 周末：op-calendar-new-table-weekend
         * 假日：op-calendar-new-table-festival
         * 休息：op-calendar-new-table-rest
         * 
         */
        var dateClasses = {
            relative: 'op-calendar-new-relative',
            weekend: 'op-calendar-new-table-weekend',
            festival: 'op-calendar-new-table-festival',
            rest: 'op-calendar-new-table-rest',
            today: 'op-calendar-new-table-today',
            selected: 'op-calendar-new-table-selected',
            othermonth: 'op-calendar-new-table-other-month'
        };
        var nwDay = new Date();
        var today = nwDay.getFullYear() + '-' + (nwDay.getMonth() + 1) + '-' + nwDay.getDate();

        var selected = $('.op-calendar-new-table-box').attr('date-selected');

        var rows = 1;
        for (var j = 0; j < month.length; j += 7) {
            rows++;
            html += '<tr>';
            for (var i = j; i < j + 7; i++) {

                // 当前日期
                var dateDay = month[i].solarCalendar.year + '-' + month[i].solarCalendar.month + '-' + month[i].solarCalendar.day;
                // 日历
                var solarDay = month[i].solarCalendar.day;
                // 阴历
                var lunarDay = month[i].lunarCalendar.day;
                // 国际节日
                var interFestival = month[i].interFestival;
                // 国内节日
                var domesticFestival = month[i].domesticFestival;
                // 法定假日
                var legalHoliday = month[i].legalHoliday;
                // 节气
                var term = month[i].chinaEra.term;

                var othermonth = month[i].solarCalendar.othermonth;
                // 默认为正常
                var dateClass = othermonth ? dateClasses['othermonth'] : dateClasses['relative'];
                // 当天
                if (dateDay == today) {
                    dateClass += ' ' + dateClasses['today'];
                }
                // 周末
                if (i % 7 == 5 || i % 7 == 6) {
                    dateClass += ' ' + dateClasses['weekend'];
                }
                // 休息
                if (legalHoliday) {
                    dateClass += ' ' + dateClasses['rest'];
                }
                // 假日
                if (term || interFestival || domesticFestival) {
                    dateClass += ' ' + dateClasses['festival'];
                    lunarDay = term || interFestival || domesticFestival;
                }
                if (dateDay == selected) {
                    dateClass += ' ' + dateClasses['selected'];
                }
                var day = {
                    dateClass: dateClass,
                    dateDay: dateDay,
                    solarDay: solarDay,
                    lunarDay: lunarDay,
                    rest: legalHoliday, //是否休息
                    othermonth: othermonth
                }

                html += DOM.template(dtmpl, day);
            }
            html += '</tr>';
        }
        html += '</tbody></table>';
        if (rows > 6) {
            html = $.template(html, {
                tableSix: 'op-calendar-new-table-six'
            });
        } else {
            html = $.template(html, {
                tableSix: ''
            });
        }
        $('.op-calendar-new-table-box').html(html);
    }
    /**
     * 当天详细情况
     * 
     * @param {Number} y 年
     * @param {Number} m 月
     * @param {Number} d 日
     */
    function detailHTML(y, m, d) {

        var month = Calendar.getCalendar(y, m);

        var dtmpl = '';
        dtmpl += '<p class="op-calendar-new-right-date"><%=today%> <%=week%></p>';
        dtmpl += '<p class="op-calendar-new-right-day"><%=dayTime%></p>';
        dtmpl += '<p class="op-calendar-new-right-lunar c-gap-top-small">';
        dtmpl += '<span><%=lunarMonth%><%=lunarDay%></span><span><%=eraYear%>年 【<%=zodiac%>】</span><span><%=eraMonth%>月 <%=eraDay%>日</span> </p>';
        dtmpl += '<div class="op-calendar-new-right-almanacbox">';
        dtmpl += '<p class="op-calendar-new-right-almanac c-clearfix">';
        dtmpl += '<span class="op-calendar-new-right-suit"><i>宜</i><%=yDay%></span>';
        dtmpl += '<span class="op-calendar-new-right-avoid"><i>忌</i><%=jDay%></span></p>';
        dtmpl += '</div>';


        for (var i in month) {
            var dateDay = month[i].solarCalendar.year + '-' + month[i].solarCalendar.month + '-' + month[i].solarCalendar.day;
            if (dateDay === y + '-' + m + '-' + d) {
                break;
            }
        }
        var selectedDay = month[i];

        m = m < 10 ? '0' + m : m;
        d = d < 10 ? '0' + d : d;

        var yDay = selectedDay.almanac ? selectedDay.almanac.y.split('.').slice(0, 6).join('<br>') : '无';
        var jDay = selectedDay.almanac ? selectedDay.almanac.j.split('.').slice(0, 6).join('<br>') : '无';
        var day = {
            today: y + '-' + m + '-' + d,
            dayTime: d,
            week: selectedDay.solarCalendar.week,
            lunarMonth: selectedDay.lunarCalendar.month,
            lunarDay: selectedDay.lunarCalendar.day,
            eraYear: selectedDay.chinaEra.year,
            eraMonth: selectedDay.chinaEra.month,
            eraDay: selectedDay.chinaEra.day,
            zodiac: selectedDay.chinaEra.zodiac,
            yDay: yDay,
            jDay: jDay
        }
        dtmpl = $.template(dtmpl, day);
        $('.op-calendar-new-right').html(dtmpl);

    }

    /**
     * 初始化年月,节日选择控件
     * @param {Number} y
     * @param {Number} m
     */
    function dropDownHTML(y, m, d) {

        /**
         * 万年历支持查询的年份范围
         */
        var minYear = 1899; //最小年限
        var maxYear = 2100; //最大年限

        // 国内传统节日
        var festival = {
            'default': '假期安排',
            'i0101': '元旦 ',
            'd0101': '春节 ',
            'd0115': '元宵节',
            'd0202': '龙头节',
            'd0505': '端午节',
            'd0707': '七夕节',
            'd0715': '中元节',
            'd0815': '中秋节',
            'd0909': '重阳节',
            'd1001': '寒衣节',
            'd1015': '下元节',
            'd1208': '腊八节',
            'd1223': '小年'
        };
        var html = '';
        for (var i = minYear + 1; i < maxYear; i++) {
            html += '<li class="c-dropdown2-option" data-value="' + i + '" data-role="y">' + i + '年</li>';
        }
        // 输入框中的年
        $('.op-calendar-new-year-box .c-dropdown2-btn').html(y + '年')
        $('.op-calendar-new-year-box .c-dropdown2-btn').attr('data-value', y);
        $('.op-calendar-new-year-box .c-dropdown2-menubox').html(html)

        var html = '';
        for (var i = 1; i <= 12; i++) {
            html += '<li class="c-dropdown2-option" data-value="' + i + '" data-role="m">' + i + '月</li>';
        }
        // 输入框中的月
        $('.op-calendar-new-month-box .c-dropdown2-btn').html(m + '月');
        $('.op-calendar-new-month-box .c-dropdown2-btn').attr('data-value', m);
        $('.op-calendar-new-month-box .c-dropdown2-menubox').html(html);

        var html = '';
        for (var i in festival) {
            html += '<li class="c-dropdown2-option" data-value="' + i + '" data-role="f">' + festival[i] + '</li>';
        }
        // 输入框中的节日
        $('.op-calendar-new-holiday-box .c-dropdown2-btn').html('假期安排');
        $('.op-calendar-new-holiday-box .c-dropdown2-btn').attr('data-value', 'default');
        $('.op-calendar-new-holiday-box .c-dropdown2-menubox').html(html);

        // 设置当前选中的日期
        $('.op-calendar-new-table-box').attr('date-selected', y + '-' + m + '-' + d);
    }
    /**
     * 更新输入框年月和当前选中的日期
     * @param {Number} y
     * @param {Number} m
     * @param {Number} d
     */
    function setDropDown(y, m, d) {
        // 更新输入框的日期
        $('.op-calendar-new-year-box .c-dropdown2-btn').attr('data-value', y);
        $('.op-calendar-new-year-box .c-dropdown2-btn').html(y + '年');
        $('.op-calendar-new-month-box .c-dropdown2-btn').attr('data-value', m);
        $('.op-calendar-new-month-box .c-dropdown2-btn').html(m + '月');
        if (d) {
            $('.op-calendar-new-table-box').attr('date-selected', y + '-' + m + '-' + d);
        }
    }

    function getDropDown() {
        // 输入框中的年
        var year = $('.op-calendar-new-year-box .c-dropdown2-btn').attr('data-value');
        // 输入框中的月
        var month = $('.op-calendar-new-month-box .c-dropdown2-btn').attr('data-value');
        // 输入框中的节日
        var festival = getFestival().date;
        // 当前选中的日期		
        var selected = $('.op-calendar-new-table-box').attr('date-selected');
        selected = (selected && selected.length > 0) ? selected.split('-')[2] : 0;

        var res = {
            year: parseInt(year, 10),
            month: parseInt(month, 10),
            festival: festival,
            selected: parseInt(selected, 10)
        }
        return res;
    }

    function setFestival(festival) {
        // 输入框中的节日
        $('.op-calendar-new-holiday-box .c-dropdown2-btn').attr('data-value', festival.date);
        $('.op-calendar-new-holiday-box .c-dropdown2-btn').html(festival.name);
    }

    function getFestival() {
        // 输入框中的节日
        var date = $('.op-calendar-new-holiday-box .c-dropdown2-btn').attr('data-value');
        var name = $('.op-calendar-new-holiday-box .c-dropdown2-btn').html();
        var res = {
            date: date,
            name: name
        };
        return res;
    }
    // 向Calendar命名空间中添加UI属性
    Calendar.UI = {
        dropDownHTML: dropDownHTML,
        getDropDown: getDropDown,
        setDropDown: setDropDown,
        setFestival: setFestival,
        getFestival: getFestival,
        detailHTML: function(y, m, d) {
            // 加载对应的库,然后初始化日历
            Calendar.loadCalendarLib(y, function() {
                detailHTML(y, m, d);
            });
        },
        calendarHTML: function(y, m) {
            // 加载对应的库,然后初始化日历
            Calendar.loadCalendarLib(y, function() {
                calendarHTML(y, m);
            });
        }
    }

    // 日历初始化入口函数
    Calendar.init = function(today) {
        // 获取当前日期
        var y = today.getFullYear();
        var m = today.getMonth() + 1;
        var d = today.getDate();

        // 生成日历下拉框
        Calendar.UI.dropDownHTML(y, m, d);

        // 初始化日历
        Calendar.UI.calendarHTML(y, m);
        Calendar.UI.detailHTML(y, m, d);
    }

}(Calendar, DOM);


+

function(cal, $) {

    // 日历对象
    var Calendar = cal || window.Calendar;

    // 下拉组件初始化
    $('.c-dropdown2').on('click', function(event) {
        // 阻止冒泡
        stopProp(event);

        // 事件源
        var target = event.currentTarget;
        // 隐藏所有的菜单
        $('.c-dropdown2-menu').hide();
        // toggle当前菜单
        $('.c-dropdown2-menu', target).toggle();

        // 鼠标移动到下拉菜单上
        $('.c-dropdown2-option', target).on('mouseover', function() {
            // 移除其他元素的选中状态
            $('.c-dropdown2-menubox li', target).removeClass('c-dropdown2-selected');
            // 给当前元素添加选中状态
            $(this).addClass('c-dropdown2-selected');
        });

        // 点击下拉菜单
        $('.c-dropdown2-option', target).on('click', function(event) {
            // 阻止冒泡
            stopProp(event);
            // 填充选中的菜单
            $('.c-dropdown2-btn', target).html(DOM(this).html());
            // 设置数值
            $('.c-dropdown2-btn', target).attr('data-value', DOM(this).attr('data-value'));
            // 隐藏菜单
            $('.c-dropdown2-menu', target).hide();

            // 触发查询
            search($(this).attr('data-role') === 'f' ? true : false);
        });

        // 点击其他地方的时候,隐藏菜单按钮
        $('body').on('click', function() {
            $('.c-dropdown2-menu').hide();
        });

        // 阻止冒泡
        function stopProp(event) {
            var event = event ? event : window.event;
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        }

    });

    // 点击日历中的某一天
    $('.op-calendar-new-table-box').on('click', function(event) {

        // this值
        // var currentTarget=event.currentTarget;

        // 获取点击事件
        var event = event ? event : window.event;
        // 事件源
        var target = event.target || event.srcElement;

        // 点击时间
        var date = target.getAttribute('date') || target.parentNode.getAttribute('date');

        if (date) {
            var year = date.split('-')[0];
            var month = date.split('-')[1];
            var day = date.split('-')[2];

            var node = target.getAttribute('date') ? target : target.parentNode;

            $('.op-calendar-new-table-box a').removeClass('op-calendar-new-table-selected');
            $(node).addClass('op-calendar-new-table-selected');

            var othermonth = $(node).attr('data-othermonth');
            $('.op-calendar-new-table-box').attr('date-selected', date);
            if (othermonth == false) {
                Calendar.UI.detailHTML(year, month, day);
            } else {
                // 设置下拉框日期
                Calendar.UI.setDropDown(year, month);
                // 触发查询
                search();
            }
        }
    });

    // 选择月
    $('.op-calendar-new-month-box').on('click', function(event) {

        // 事件源
        var target = event.target || event.srcElement;

        var res = Calendar.UI.getDropDown();
        var year = res.year;
        var month = res.month;

        if ($(target).hasClass('op-calendar-new-prev-month')) {
            year = month > 1 ? year : year - 1;
            month = month > 1 ? month - 1 : 12;
        }
        if ($(target).hasClass('op-calendar-new-next-month')) {
            year = month < 12 ? year : year + 1;
            month = month < 12 ? month + 1 : 1;
        }
        // 设置下拉框日期
        Calendar.UI.setDropDown(year, month);

        // 触发查询
        search();
    });

    // 回到今天
    $('.op-calendar-new-backtoday').on('click', function(event) {
        // 重新初始化日历
        Calendar.init(new Date());
    });



    function search(qfestival) {
        // 获取下拉框的年月和节日
        var res = Calendar.UI.getDropDown();
        // 输入框中的年
        var year = res.year;
        // 输入框中的月
        var month = res.month;
        // 当前日期
        var day = (new Date()).getDate();
        // 输入框中的节日
        var festival = res.festival;
        // 当前选中的日期
        var selected = res.selected;

        if (festival != 'default' && qfestival) {

            var fm = parseInt(festival.substring(1, 3), 10);
            var fd = parseInt(festival.substring(3, 5), 10);

            // 国内传统节日 农历转公历
            if (!festival.startsWith('i')) {
                var fdays = Calendar.getSolarCalendar(year, fm, fd);
                year = fdays[0].year;
                month = fdays[0].month;
                day = fdays[0].day;

            } else {
                month = fm;
                day = fd;
            }

            // 更新输入框的日期
            Calendar.UI.setDropDown(year, month, day);

            Calendar.UI.calendarHTML(year, month);
            Calendar.UI.detailHTML(year, month, day);

        } else {
            Calendar.UI.setFestival({
                date: 'default',
                name: '假期安排'
            });
            // 更新输入框的日期
            Calendar.UI.setDropDown(year, month, selected || day);

            Calendar.UI.calendarHTML(year, month);
            Calendar.UI.detailHTML(year, month, selected || day);

        }
    }
}(Calendar, DOM);

/**
 * 说明: 该模块主要用于组装 calendar.js dom.js event.js 生成日历
 * 
 * 作者: xiabing
 * 日期: 20181126
 */
+

function(cal) {

    // 日历对象
    var Calendar = cal || window.Calendar;
    // 初始化日历
    Calendar.init(new Date());

}(Calendar);




///////////////////////////
var CalendarData = new Array(20);
var madd = new Array(12);
var TheDate = new Date();
var tgString = "甲乙丙丁戊己庚辛壬癸";
var dzString = "子丑寅卯辰巳午未申酉戌亥";
var numString = "一二三四五六七八九十";
var monString = "正二三四五六七八九十冬腊";
var weekString = "日一二三四五六";
var sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
var cYear;
var cMonth;
var cDay;
var cHour;
var cDateString;
var DateString;
var Browser = navigator.appName;

function init() {
    CalendarData[0] = 0x41A95;
    CalendarData[1] = 0xD4A;
    CalendarData[2] = 0xDA5;
    CalendarData[3] = 0x20B55;
    CalendarData[4] = 0x56A;
    CalendarData[5] = 0x7155B;
    CalendarData[6] = 0x25D;
    CalendarData[7] = 0x92D;
    CalendarData[8] = 0x5192B;
    CalendarData[9] = 0xA95;
    CalendarData[10] = 0xB4A;
    CalendarData[11] = 0x416AA;
    CalendarData[12] = 0xAD5;
    CalendarData[13] = 0x90AB5;
    CalendarData[14] = 0x4BA;
    CalendarData[15] = 0xA5B;
    CalendarData[16] = 0x60A57;
    CalendarData[17] = 0x52B;
    CalendarData[18] = 0xA93;
    CalendarData[19] = 0x40E95;
    madd[0] = 0;
    madd[1] = 31;
    madd[2] = 59;
    madd[3] = 90;
    madd[4] = 120;
    madd[5] = 151;
    madd[6] = 181;
    madd[7] = 212;
    madd[8] = 243;
    madd[9] = 273;
    madd[10] = 304;
    madd[11] = 334;
}

function GetBit(m, n) {
    return (m >> n) & 1;
}

function e2c() {
    var total, m, n, k;
    var isEnd = false;
    var tmp = TheDate.getYear();
    if (tmp < 1900) tmp += 1900;
    total = (tmp - 2001) * 365 +
        Math.floor((tmp - 2001) / 4) +
        madd[TheDate.getMonth()] +
        TheDate.getDate() -
        23;
    if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1)
        total++;
    for (m = 0;; m++) {
        k = (CalendarData[m] < 0xfff) ? 11 : 12;
        for (n = k; n >= 0; n--) {
            if (total <= 29 + GetBit(CalendarData[m], n)) {
                isEnd = true;
                break;
            }
            total = total - 29 - GetBit(CalendarData[m], n);
        }
        if (isEnd) break;
    }
    cYear = 2001 + m;
    cMonth = k - n + 1;
    cDay = total;
    if (k == 12) {
        if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1)
            cMonth = 1 - cMonth;
        if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1)
            cMonth--;
    }
    cHour = Math.floor((TheDate.getHours() + 3) / 2);
}

function GetcDateString() {
    var tmp = "";
    tmp += tgString.charAt((cYear - 4) % 10); //年干  
    tmp += dzString.charAt((cYear - 4) % 12); //年支  
    tmp += "年(";
    tmp += sx.charAt((cYear - 4) % 12);
    tmp += ")";
    if (cMonth < 1) {
        tmp += "闰";
        tmp += monString.charAt(-cMonth - 1);
    } else
        tmp += monString.charAt(cMonth - 1);
    tmp += "月";
    tmp += (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "卅"));
    if (cDay % 10 != 0 || cDay == 10)
        tmp += numString.charAt((cDay - 1) % 10);
    //if(cHour==13)tmp+="夜";  
    //tmp+=dzString.charAt((cHour-1)%12);  
    //tmp+="时";  
    cDateString = tmp;
    return tmp;
}




function showLocale(objD) {

    var str, colorhead, colorfoot;
    var hh = objD.getHours();
    var year = TheDate.getYear()
    year = (year < 2000) ? year + 1900 : year;
    if (hh < 10) hh = '0' + hh;
    if (hh == 24) hh = 0;
    init();
    e2c();
    GetcDateString();

    var mm = objD.getMinutes();
    if (mm < 10) mm = '0' + mm;
    var ss = objD.getSeconds();
    if (ss < 10) ss = '0' + ss;
    var ww = objD.getDay();
    if (ww == 0) colorhead = "<font color=\"black\">";
    if (ww > 0 && ww < 7) colorhead = "<font color=\"black\">";
    if (ww == 0) ww = "星期日";
    if (ww == 1) ww = "星期一";
    if (ww == 2) ww = "星期二";
    if (ww == 3) ww = "星期三";
    if (ww == 4) ww = "星期四";
    if (ww == 5) ww = "星期五";
    if (ww == 6) ww = "星期六";
    colorfoot = "</font>"
    str = colorhead + "<span class=\"thin\">" + year + " " + cDateString + " " + colorfoot;
    return (str);
};

function tick() {
    var today;
    today = new Date();
    document.getElementById("localtime").innerHTML = showLocale(today);
    window.setTimeout("tick()", 1000);
};
tick();