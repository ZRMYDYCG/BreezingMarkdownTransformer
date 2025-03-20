import { defineEventHandler, getQuery } from 'h3'
import { JSDOM } from 'jsdom'
import axios from 'axios'

// 类型定义
interface Html2Md {
    dom: HTMLElement | null
    qUrl: string
    lazyAttrs: string[]
    dealLazyImg(img: HTMLImageElement): string
    getAbsoluteUrl(p: string): string
    changeRelativeUrl(): Html2Md
    addOriginText(): Html2Md
    getInnerHtml(): string
    returnFinalHtml(): string
    getDom(html: string, selector: string): HTMLElement | null
    getTitle(content: string): string
    getBody(content: string): string
}


const html2md: Html2Md = {
    dom: null,
    qUrl: '',
    lazyAttrs: ['data-src', 'data-original-src', 'data-original', 'src'],

    dealLazyImg(img: HTMLImageElement) {
        for (const attr of this.lazyAttrs) {
            const src = img.getAttribute(attr)
            if (src) return src
        }
        return ''
    },

    getAbsoluteUrl(p: string) {
        try {
            return new URL(p, this.qUrl).href
        } catch {
            return p
        }
    },

    changeRelativeUrl() {
        if (!this.dom) return this

        const imgs = this.dom.getElementsByTagName('img')
        for (const img of Array.from(imgs)) {
            const src = this.dealLazyImg(img)
            img.setAttribute('src', this.getAbsoluteUrl(src))
        }

        const links = this.dom.getElementsByTagName('a')
        for (const link of Array.from(links)) {
            const href = link.getAttribute('href') || this.qUrl
            link.setAttribute('href', this.getAbsoluteUrl(href))
        }
        return this
    },

    addOriginText() {
        if (!this.dom) return this

        const originDom = new JSDOM('').window.document.createElement('div')
        originDom.innerHTML = `<br/><div>本文转自 <a href="${this.qUrl}" target="_blank">${this.qUrl}</a>，如有侵权，请联系删除。</div>`
        this.dom.appendChild(originDom)
        return this
    },

    getInnerHtml() {
        return this.dom?.innerHTML || ''
    },

    returnFinalHtml() {
        return this.changeRelativeUrl().addOriginText().getInnerHtml()
    },

    getDom(html: string, selector: string) {
        try {
            const dom = new JSDOM(html)
            return dom.window.document.querySelector(selector)
        } catch {
            return null
        }
    },

    getTitle(content: string) {
        const title = this.getDom(content, 'title')
        return title?.textContent || '获取标题失败~'
    },

    getBody(content: string) {
        const getBySelector = (selector: string) => this.getDom(content, selector)

        // 各平台处理逻辑
        // juejin
        if (this.qUrl.includes('juejin.cn')) {
            const htmlContent = getBySelector('.markdown-body')
            htmlContent?.querySelectorAll('.copy-code-btn').forEach(v => v.remove())
            this.dom = htmlContent
            return this.returnFinalHtml()
        }
        // oschina
        if (this.qUrl.includes('oschina.net')) {
            const htmlContent = getBySelector('.article-detail')!
            const extraDom = htmlContent.querySelector('.ad-wrap')
            extraDom && extraDom.remove()
            this.dom = htmlContent
            return this.returnFinalHtml()
        }
        // cnblogs
        if (this.qUrl.includes('cnblogs.com')) {
            this.dom = getBySelector('#cnblogs_post_body')
            return this.returnFinalHtml()
        }
        // weixin
        if (this.qUrl.includes('weixin.qq.com')) {
            this.dom = getBySelector('#js_content')
            return this.returnFinalHtml()
        }
        // 知乎专栏
        if (this.qUrl.includes('zhuanlan.zhihu.com')) {
            const htmlContent = getBySelector('.RichText')!
            const extraScript = htmlContent.querySelectorAll('noscript')
            extraScript.length > 0 && extraScript.forEach((v) => { v.remove() })
            this.dom = htmlContent
            return this.returnFinalHtml()
        }
        // 慕课专栏
        if (this.qUrl.includes('www.imooc.com')) {
            const htmlContent = getBySelector('.article-con')
            this.dom = htmlContent
            return this.returnFinalHtml()
        }
        // learnku
        if (this.qUrl.includes('learnku.com')) {
            const htmlContent = getBySelector('.markdown-body')!
            const extraScript = htmlContent.querySelectorAll('.toc-wraper')
            extraScript.length > 0 && extraScript.forEach((v) => { v.remove() })
            const extraToc = htmlContent.querySelectorAll('.markdown-toc')
            extraToc.length > 0 && extraToc.forEach((v) => { v.remove() })
            const extraLink = htmlContent.querySelectorAll('.reference-link')
            extraLink.length > 0 && extraLink.forEach((v) => { v.remove() })
            this.dom = htmlContent
            return this.returnFinalHtml()
        }

        // 默认处理
        const htmlArticle = getBySelector('article') || getBySelector('body')
        this.dom = htmlArticle
        return this.returnFinalHtml()
    }
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const url = decodeURIComponent(query.url as string)
    html2md.qUrl = url

    const mockSiteUa = ['juejin.cn']
    const headers = mockSiteUa.some(site => url.includes(site)) ? {
        'User-Agent': 'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)'
    } : {}

    try {
        const response = await axios.get(url, { headers })
        const body = response.data

        return {
            code: 1,
            title: html2md.getTitle(body),
            html: html2md.getBody(body)
        }
    } catch (error) {
        return {
            code: 0,
            msg: '文章请求失败'
        }
    }
})
