<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns="http://www.w3.org/2000/svg">

    <xsl:output method="xml" encoding="utf-8" indent="yes"/>

    <xsl:template match="/">
        <xsl:apply-templates select="//графика"/>
    </xsl:template>

    <xsl:template match="графика">
        <svg width="{@ширина}" height="{@высота}"
             viewBox="0 0 {@ширина} {@высота}">
            <xsl:apply-templates select="эллипс"/>
        </svg>
    </xsl:template>

    <xsl:template match="эллипс">
        <ellipse id="{@id}"
                 cx="{@cx}" cy="{@cy}" rx="{@rx}" ry="{@ry}"
                 fill="{@заливка}"
                 stroke="{@ободок}"
                 stroke-width="{@ширина-ободка}"/>
    </xsl:template>

</xsl:stylesheet>