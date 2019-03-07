## Cran comments

#### 2019-3-7

This is a new release.

Please let me know if there is anything else I can provide.

Thank you,
Barret


## R CMD check results

0 errors | 0 warnings | 1 note

* NOTES:
  * checking CRAN incoming feasibility ... NOTE
    Maintainer: 'Barret Schloerke <barret@rstudio.com>'
    New submission
  * checking installed package size ... NOTE
    installed size is  7.8Mb
    sub-directories of 1Mb or more:
      doc        1.8Mb
      reactlog   5.4Mb


## Test environments

#### local OS X install, R 3.5.2

* NOTES:
  * checking CRAN incoming feasibility ... NOTE
    Maintainer: 'Barret Schloerke <barret@rstudio.com>'
    New submission
  * checking installed package size ... NOTE
    installed size is  7.8Mb
    sub-directories of 1Mb or more:
      doc        1.8Mb
      reactlog   5.4Mb

#### ubuntu 14.04 (on travis-ci)

* R 3.4.4
  * checking installed package size ... NOTE
    installed size is  7.9Mb
    sub-directories of 1Mb or more:
      doc        1.8Mb
      reactlog   5.4Mb

* R 3.5.2
  * checking installed package size ... NOTE
    installed size is  7.9Mb
    sub-directories of 1Mb or more:
      doc        1.8Mb
      reactlog   5.4Mb

* R Under development (unstable) (2019-03-07 r76210)
  * checking for future file timestamps ... WARNING
    unable to verify current time
  * checking installed package size ... NOTE
    installed size is  7.9Mb
    sub-directories of 1Mb or more:
      doc        1.8Mb
      reactlog   5.4Mb


#### win-builder (devel and release)

* R Under development (unstable) (2019-03-05 r76200)
  * checking CRAN incoming feasibility ... NOTE
    Maintainer: 'Barret Schloerke <barret@rstudio.com>'
    New submission
    Possibly mis-spelled words in DESCRIPTION:
    Reactivity (2:14)

* R version 3.5.2 (2018-12-20)
  * checking CRAN incoming feasibility ... NOTE
    Maintainer: 'Barret Schloerke <barret@rstudio.com>'
    New submission
    Possibly mis-spelled words in DESCRIPTION:
      Reactivity (2:14)
  * checking installed package size ... NOTE
    installed size is  7.8Mb
    sub-directories of 1Mb or more:
      doc        1.8Mb
      reactlog   5.4Mb


#### rhub

* Build ID:   reactlog_1.0.0.tar.gz-016d7182c9ba41bfb544fbea5ab757f1
  Platform:   Windows Server 2008 R2 SP1, R-release, 32/64 bit
  Submitted:  6.6s ago
  Build time: 3m 13.3s
  ❯ checking CRAN incoming feasibility ... NOTE
    Maintainer: 'Barret Schloerke <barret@rstudio.com>'
    New submission
  ❯ checking installed package size ... NOTE
    installed size is  7.8Mb
    sub-directories of 1Mb or more:
      doc        1.8Mb
      reactlog   5.4Mb
  0 errors ✔ | 0 warnings ✔ | 2 notes ✖

* Build ID:   reactlog_1.0.0.tar.gz-61f7b59afb8a46c9bc887b9733c6f534
  Platform:   Windows Server 2008 R2 SP1, R-devel, 32/64 bit
  Submitted:  6.6s ago
  Build time: 3m 13.3s
  ❯ checking for future file timestamps ... WARNING
    unable to verify current time
  ❯ checking CRAN incoming feasibility ... NOTE
    Maintainer: 'Barret Schloerke <barret@rstudio.com>'
    New submission
  ❯ checking installed package size ... NOTE
    installed size is  7.8Mb
    sub-directories of 1Mb or more:
      doc        1.8Mb
      reactlog   5.4Mb
  0 errors ✔ | 1 warning ✖ | 2 notes ✖

* Build ID:   reactlog_1.0.0.tar.gz-1a9083c09e4e459da6f1aeea077bbde3
  Platform:   Ubuntu Linux 16.04 LTS, R-release, GCC
  Submitted:  6.6s ago
  Build time: 6m 36.1s
  ❯ checking CRAN incoming feasibility ... NOTE
    Maintainer: ‘Barret Schloerke <barret@rstudio.com>’
    New submission
  ❯ checking installed package size ... NOTE
      installed size is  7.9Mb
      sub-directories of 1Mb or more:
        doc        1.8Mb
        reactlog   5.4Mb
  ❯ checking DESCRIPTION meta-information ... NOTE
    Author field differs from that derived from Authors@R
      Author:    ‘Barret Schloerke [aut, cre] (<https://orcid.org/0000-0001-9986-114X>), Joe Cheng [ctb], RStudio [cph, fnd]’
      Authors@R: ‘Barret Schloerke [aut, cre] (0000-0001-9986-114X), Joe Cheng [ctb], RStudio [cph, fnd]’
  0 errors ✔ | 0 warnings ✔ | 3 notes ✖

* Build ID:   reactlog_1.0.0.tar.gz-e0b411a33ef246349123a68b6d70876e
  Platform:   Fedora Linux, R-devel, clang, gfortran
  Submitted:  6.6s ago
  Build time: 6m 3.7s
  PREPERROR
    * Can not install dependencies: `#> sh: file: command not found`
    * Link: https://builder.r-hub.io/status/reactlog_1.0.0.tar.gz-10e33c0eb6924ed69cb0abd965072ab0#L1160
