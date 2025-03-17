// server/api/getMdFile.post.ts
import { defineEventHandler, readBody } from 'h3'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'pathe'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { md = '## 空空如也', url = 'https://www.helloworld.net' } = body

    const folderName = 'download'
    const publicPath = process.cwd()
    const downLoadPath = join(publicPath, 'public', folderName)

    const writeFile = () => {
        try {
            const mdName = `${Date.now()}.md`
            writeFileSync(join(downLoadPath, mdName), md)
            return {
                code: 1,
                path: `${url}/${folderName}/${mdName}`
            }
        } catch (error) {
            return {
                code: 0,
                msg: '文件写入失败'
            }
        }
    }

    if (!existsSync(downLoadPath)) {
        mkdirSync(downLoadPath, { recursive: true })
    }

    return writeFile()
})