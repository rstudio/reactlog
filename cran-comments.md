## CRAN comments

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
