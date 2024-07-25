const gulp = require("gulp")
// HTML
const fileInclude = require("gulp-file-include")
const htmlclean = require("gulp-htmlclean")
const webpHTML = require("gulp-webp-retina-html")
const typograf = require("gulp-typograf")
// SASS
const sass = require("gulp-sass")(require("sass"))
const sassGlob = require("gulp-sass-glob")
const autoprefixer = require("gulp-autoprefixer")
const csso = require("gulp-csso")
const webpCSS = require("gulp-webp-css")
// IMAGES
const imagemin = require("gulp-imagemin")
const imageminWebp = require("imagemin-webp")
const webp = require("gulp-webp")
const rename = require("gulp-rename")
//
const server = require("gulp-server-livereload")
const clean = require("gulp-clean")
const fs = require("fs")
const plumber = require("gulp-plumber")
const notify = require("gulp-notify")
const webpack = require("webpack-stream")
const babel = require("gulp-babel")
const changed = require("gulp-changed")
const replace = require("gulp-replace")

const srcPath = `./src`
const docsPath = `./docs/`
const htmlSettings = {
    prefix: "@@",
    basepath: "@file",
}
const serverOptions = {
    livereload: true,
    open: true,
}
const plumberNotify = title => {
    return {
        errorHandler: notify.onError({
            title: title,
            message: "Ошибка: <%= error.message %>",
            sound: false,
        }),
    }
}

gulp.task("html:docs", function () {
    return gulp
    .src([`${srcPath}/html/**/*.html`, `!${srcPath}/html/blocks/*.html`])
    .pipe(changed(docsPath))
    .pipe(plumber(plumberNotify("HTML")))
    .pipe(fileInclude(htmlSettings))
    .pipe(
        replace(/<img(?:.|\n|\r)*?>/g, function (match) {
            return match.replace(/\r?\n|\r/g, "").replace(/\s{2,}/g, " ")
        })
    ) //удаляет лишние пробелы и переводы строк внутри тега <img>
    .pipe(
        replace(
            /(?<=src=|href=|srcset=)(['"])(\.(\.)?\/)*(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
            "$1./$4$5$7$1"
        )
    )
    .pipe(
        typograf({
            locale: ["ru", "en-US"],
            htmlEntity: {type: "digit"},
            safeTags: [
                ["<\\?php", "\\?>"],
                ["<no-typography>", "</no-typography>"],
            ],
        })
    )
    .pipe(
        webpHTML({
            extensions: ["jpg", "jpeg", "png", "gif", "webp"],
            // retina: {
            //     1: "",
            //     2: "@2x",
            // },
        })
    )
    .pipe(htmlclean())
    .pipe(gulp.dest(docsPath))
})

gulp.task("sass:docs", function () {
    return gulp
    .src(`${srcPath}/scss/*.scss`)
    .pipe(changed(`${docsPath}css/`))
    .pipe(plumber(plumberNotify("Styles")))
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(webpCSS())
    .pipe(
        replace(
            /(['"]?)(\.\.\/)+(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
            "$1$2$3$4$6$1"
        )
    )
    .pipe(csso())
    .pipe(gulp.dest(`${docsPath}css/`))
})

gulp.task("images:docs", function () {
    return gulp
    .src([`${srcPath}/img/**/*`, `!${srcPath}/img/icons/**/*`])
    .pipe(changed(`${docsPath}img/`))
    .pipe(
        imagemin([
            imageminWebp({
                quality: 85,
            }),
        ])
    )
    .pipe(rename({extname: ".webp"}))
    .pipe(webp())
    .pipe(gulp.dest(`${docsPath}img/`))
    .pipe(gulp.src(`${srcPath}/img/**/*`))
    .pipe(changed(`${docsPath}img/`))
    .pipe(
        imagemin(
            [
                imagemin.gifsicle({interlaced: true}),
                imagemin.mozjpeg({quality: 85, progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
            ],
            {verbose: true}
        )
    )
    .pipe(gulp.dest(`${docsPath}img/`))
})

gulp.task("files:docs", function () {
    return gulp
    .src(`${srcPath}/files/**/*`)
    .pipe(changed(`${docsPath}files/`))
    .pipe(gulp.dest(`${docsPath}files/`))
})

gulp.task("js:docs", function () {
    return gulp
    .src(`${srcPath}/js/*.js`)
    .pipe(changed(`${docsPath}js/`))
    .pipe(plumber(plumberNotify("JavaScript")))
    .pipe(babel())
    .pipe(webpack(require("../webpack.config.js")))
    .pipe(gulp.dest(`${docsPath}js/`))
})

gulp.task("server:docs", function () {
    return gulp.src(docsPath).pipe(server(serverOptions))
})

gulp.task("clean:docs", function (done) {
    if (fs.existsSync(docsPath)) {
        return gulp.src(docsPath, {read: false}).pipe(clean({force: true}))
    }
    done()
})
