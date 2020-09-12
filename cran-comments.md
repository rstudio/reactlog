## CRAN comments

#### 2020-9-12

I've updated the links. Thank you!

Best,
Barret


#### 2020-9-12

Thanks, we see:

```
   Found the following (possibly) invalid URLs:
     URL: https://community.rstudio.com/c/shiny (moved to
https://community.rstudio.com/c/shiny/8)
       From: README.md
       Status: 200
       Message: OK
     URL:
https://resources.rstudio.com/rstudio-conf-2019/reactlog-2-0-debugging-the-state-of-shiny
(moved to
https://rstudio.com/resources/rstudioconf-2019/reactlog-2-0-debugging-the-state-of-shiny/)
       From: inst/doc/reactlog.html
       Status: 200
       Message: OK
     URL: https://yarnpkg.com/en/ (moved to https://classic.yarnpkg.com/en/)
       From: README.md
       Status: 200
       Message: OK
     URL: https://yarnpkg.com/en/docs/install (moved to
https://classic.yarnpkg.com/en/docs/install)
       From: README.md
       Status: 200
       Message: OK
```

Please change http --> https, add trailing slashes, or follow moved
content as appropriate.

Please fix and resubmit.

Best,
Uwe Ligges

#### 2019-9-11

I've added new features and bug fixes to reactlog.

Please let me know if there is anything else I can provide.

Thank you,
Barret


## R CMD check results

0 errors | 0 warnings | 0 notes

## Test environments

* local macOS, R 4.0.0
* GitHub Actions
  * macOS
    * oldrel, release, devel
  * windows
    * release
  * ubuntu16
    * 3.3, 3.4, 3.5, oldrel, release, devel
0 errors ✔ | 0 warnings ✔ | 0 notes ✔

* devtools::check_win_devel()

  * checking CRAN incoming feasibility ... NOTE
    Maintainer: 'Barret Schloerke <barret@rstudio.com>'

    Possibly mis-spelled words in DESCRIPTION:
      Reactivity (2:8)
      Schloerke (15:4)
      reactivity (16:29)
  Status: 1 NOTE

  * I believe spellings these are false positives.
    * `Schloerke` is my last name
    * `reactivity` is a word we use to describe how reactive values work within 'shiny'.

## revdepcheck results

We checked 1 reverse dependencies, comparing R CMD check results across CRAN and dev versions of this package.

 * We saw 0 new problems
 * We failed to check 0 packages
