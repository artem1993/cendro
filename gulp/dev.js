const gulp = require("gulp")
const fileInclude = require("gulp-file-include")
const sass = require("gulp-sass")(require("sass"))
const sassGlob = require("gulp-sass-glob")
const server = require("gulp-server-livereload")
const clean = require("gulp-clean")
const fs = require("fs")
const sourcemaps = require("gulp-sourcemaps")
const plumber = require("gulp-plumber")
const notify = require("gulp-notify")
const webpack = require("webpack-stream")
const imagemin = require("gulp-imagemin")
const changed = require("gulp-changed")
const typograf = require("gulp-typograf")
const replace = require("gulp-replace")
const webpHTML = require("gulp-webp-retina-html")
const imageminWebp = require("imagemin-webp")
const rename = require("gulp-rename")

const srcPath = `./src`
const buildPath = `./build/`
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

gulp.task("html:dev", function () {
    return gulp
    .src([`${srcPath}/html/**/*.html`, `!${srcPath}/html/blocks/*.html`])
    .pipe(changed(buildPath, {hasChanged: changed.compareContents}))
    .pipe(plumber(plumberNotify("HTML")))
    .pipe(fileInclude(htmlSettings))
    .pipe(
        replace(/<img(?:.|\n|\r)*?>/g, function (match) {
            return match.replace(/\r?\n|\r/g, "").replace(/\s{2,}/g, " ")
        })
    )
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
    .pipe(gulp.dest(buildPath))
})

gulp.task("sass:dev", function () {
    return gulp
    .src(`${srcPath}/scss/*.scss`)
    .pipe(changed(`${buildPath}css/`))
    .pipe(plumber(plumberNotify("Styles")))
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(
        replace(
            /(['"]?)(\.\.\/)+(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
            "$1$2$3$4$6$1"
        )
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${buildPath}css/`))
})

gulp.task("images:dev", function () {
    return gulp
    .src([`${srcPath}/img/**/*`, `!${srcPath}/img/icons/*`])
    .pipe(changed(`${buildPath}img/`))
    .pipe(
        imagemin([
            imageminWebp({
                quality: 85,
            }),
        ])
    )
    .pipe(rename({extname: ".webp"}))
    .pipe(gulp.dest(`${buildPath}img/`))
    .pipe(gulp.src(`${srcPath}/img/**/*`))
    .pipe(changed(`${buildPath}img/`))
    .pipe(gulp.dest(`${buildPath}img/`))
})

gulp.task("files:dev", function () {
    return gulp
    .src(`${srcPath}/files/**/*`)
    .pipe(changed(`${buildPath}files/`))
    .pipe(gulp.dest(`${buildPath}files/`))
})

gulp.task("js:dev", function () {
    return gulp
    .src(`${srcPath}/js/*.js`)
    .pipe(changed(`${buildPath}js/`))
    .pipe(plumber(plumberNotify("JavaScript")))
    .pipe(webpack(require("./../webpack.config.js")))
    .pipe(gulp.dest(`${buildPath}js/`))
})

gulp.task("server:dev", function () {
    return gulp.src(buildPath).pipe(server(serverOptions))
})

gulp.task("clean:dev", function (done) {
    if (fs.existsSync(buildPath)) {
        return gulp.src(buildPath, {read: false}).pipe(clean({force: true}))
    }
    done()
})

gulp.task("watch:dev", function () {
    gulp.watch(`${srcPath}/scss/**/*.scss`, gulp.parallel("sass:dev"))
    gulp.watch(`${srcPath}/**/*.html`, gulp.parallel("html:dev"))
    gulp.watch(`${srcPath}/img/**/*`, gulp.parallel("images:dev"))
    gulp.watch(`${srcPath}/files/**/*`, gulp.parallel("files:dev"))
    gulp.watch(`${srcPath}/js/**/*.js`, gulp.parallel("js:dev"))
})
