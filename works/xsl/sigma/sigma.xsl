<?xml version="1.0" encoding="utf-8" ?>
<!-- Выдуманный математический язык -> MathML. Каждый тег языка один к одному отображается на тег MathML,
     порядок дочерних элементов у дроби, индексов и "низверх" совпадает с порядком в MathML. -->
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns="http://www.w3.org/1998/Math/MathML">

    <!-- about:legacy-compat - единственный способ получить из XSLT 1.0 доктайп, валидный для HTML5 -->
    <xsl:output method="html" encoding="utf-8" indent="yes" doctype-system="about:legacy-compat"/>

    <!-- Пробелы и переносы между тегами исходника не нужны в формуле -->
    <xsl:strip-space elements="*"/>

    <!-- Страница-обёртка: формула выводится в блоке <math>, стили общие с сайтом.
         Пространство имён по умолчанию в файле - MathML, поэтому у обёртки оно явно сброшено (xmlns=""). -->
    <xsl:template match="/">
        <html xmlns="" lang="ru">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <title>XSL-преобразования - Sigma</title>
                <link rel="stylesheet" href="../../../assets/style.css"/>
            </head>
            <body>
                <main>
                    <h1>Среднеквадратичное отклонение</h1>
                    <h4 class="login">malodushev_m</h4>
                    <section class="card">
                        <math display="block" xmlns="http://www.w3.org/1998/Math/MathML">
                            <xsl:apply-templates/>
                        </math>
                    </section>
                    <p><a href="../">← к работе «XSL-преобразования»</a></p>
                </main>
            </body>
        </html>
    </xsl:template>

    <!-- Группа элементов в строку -->
    <xsl:template match="строка">
        <mrow><xsl:apply-templates/></mrow>
    </xsl:template>

    <!-- Листья: переменная, знак, число -->
    <xsl:template match="операнд">
        <mi><xsl:value-of select="."/></mi>
    </xsl:template>

    <xsl:template match="оператор">
        <mo><xsl:value-of select="."/></mo>
    </xsl:template>

    <xsl:template match="число">
        <mn><xsl:value-of select="."/></mn>
    </xsl:template>

    <!-- Конструкции: дочерние элементы уже стоят в порядке, который ждёт MathML -->
    <xsl:template match="корень">
        <msqrt><xsl:apply-templates/></msqrt>
    </xsl:template>

    <!-- числитель, знаменатель -->
    <xsl:template match="дробь">
        <mfrac><xsl:apply-templates/></mfrac>
    </xsl:template>

    <!-- основа, нижний предел, верхний предел -->
    <xsl:template match="низверх">
        <munderover><xsl:apply-templates/></munderover>
    </xsl:template>

    <!-- основа, показатель -->
    <xsl:template match="верх">
        <msup><xsl:apply-templates/></msup>
    </xsl:template>

    <!-- основа, индекс -->
    <xsl:template match="низ">
        <msub><xsl:apply-templates/></msub>
    </xsl:template>

</xsl:stylesheet>
