## Cran comments

#### 2019-3-7

This is a new release.

Please let me know if there is anything else I can provide.

Thank you,
Barret


## R CMD check results

Overall there is a consistent note of two sub-directories over 1Mb and a note that it is a new submission.

0 errors | 0 warnings | 1 note

* NOTES:
  * checking CRAN incoming feasibility ... NOTE
    Maintainer: 'Barret Schloerke <barret@rstudio.com>'
    New submission
  * checking installed package size ... NOTE
    installed size is  7.4Mb
    sub-directories of 1Mb or more:
      doc        1.8Mb
      reactlog   5.4Mb


The WARNING for the README.md conversion on rhub is most likely due to rhub's setup.  The NOTE for window's old release not converting Authors@R consistently.



## Test environments

#### local OS X install, R 3.5.2
* NOTES:
  * checking CRAN incoming feasibility ... NOTE
    Maintainer: 'Barret Schloerke <barret@rstudio.com>'
    New submission
  * checking installed package size ... NOTE
    installed size is  7.4Mb
    sub-directories of 1Mb or more:
      doc        1.8Mb
      reactlog   5.4Mb

#### ubuntu 14.04 (on travis-ci)

* R 3.4.4
  * checking installed package size ... NOTE
    installed size is  7.4Mb
    sub-directories of 1Mb or more:
      doc        1.8Mb
      reactlog   5.4Mb

* R 3.5.2
  * checking installed package size ... NOTE
    installed size is  7.4Mb
    sub-directories of 1Mb or more:
      doc        1.8Mb
      reactlog   5.4Mb

* R Under development (unstable) (2019-03-14 r76232)
  * checking installed package size ... NOTE
    installed size is  7.4Mb
    sub-directories of 1Mb or more:
      doc        1.8Mb
      reactlog   5.4Mb


#### win-builder (devel and release)

* R version 3.4.4 (2018-03-15)
  * checking CRAN incoming feasibility ... NOTE
  Maintainer: 'Barret Schloerke <barret@rstudio.com>'

  New submission
  * checking installed package size ... NOTE
    installed size is  7.4Mb
    sub-directories of 1Mb or more:
      doc        1.8Mb
      reactlog   5.4Mb
  * checking DESCRIPTION meta-information ... NOTE
  Author field differs from that derived from Authors@R
    Author:    'Barret Schloerke [aut, cre] (<https://orcid.org/0000-0001-9986-114X>), Joe Cheng [ctb], RStudio [cph, fnd]'
    Authors@R: 'Barret Schloerke [aut, cre] (0000-0001-9986-114X), Joe Cheng [ctb], RStudio [cph, fnd]'

* R Under development (unstable) (2019-03-12 r76226)
  * checking CRAN incoming feasibility ... NOTE
  Maintainer: 'Barret Schloerke <barret@rstudio.com>'

  New submission

* R version 3.5.3 (2019-03-11)
  * checking CRAN incoming feasibility ... NOTE
  Maintainer: 'Barret Schloerke <barret@rstudio.com>'

  New submission
  * checking installed package size ... NOTE
    installed size is  7.4Mb
    sub-directories of 1Mb or more:
      doc        1.8Mb
      reactlog   5.4Mb

#### rhub

* Build ID: reactlog_1.0.0.tar.gz-f669dd93575b41a184b1b4d28653e687
  Platform: Windows Server 2008 R2 SP1, R-devel, 32/64 bit
  R Under development (unstable) (2019-03-09 r76216)
  * checking CRAN incoming feasibility ... NOTE
  Maintainer: 'Barret Schloerke <barret@rstudio.com>'

  New submission

  Size of tarball: 7138656 bytes
  * checking installed package size ... NOTE
    installed size is  7.3Mb
    sub-directories of 1Mb or more:
      reactlog   5.4Mb
      doc        1.8Mb

* Build ID: reactlog_1.0.0.tar.gz-b645116d73b04dfc8e0881788f0786ee
  Platform: Windows Server 2008 R2 SP1, R-release, 32/64 bit
  R version 3.5.3 (2019-03-11)
  * checking CRAN incoming feasibility ... NOTE
  Maintainer: 'Barret Schloerke <barret@rstudio.com>'
  New submission

  Size of tarball: 7138656 bytes
  * checking installed package size ... NOTE
    installed size is  7.3Mb
    sub-directories of 1Mb or more:
      reactlog   5.4Mb
      doc        1.8Mb

* Build ID:   reactlog_1.0.0.tar.gz-4f7745e321db443e8b9b1bcc38e72a50
  Platform:   Ubuntu Linux 16.04 LTS, R-release, GCC
  R version 3.5.3 (2019-03-11) -- "Great Truth"
  * checking top-level files ... WARNING
  Conversion of ‘README.md’ failed:
  (ConnectionFailure getProtocolByName: does not exist (no such protocol name: tcp))
  * checking CRAN incoming feasibility ... NOTE
  Maintainer: ‘Barret Schloerke <barret@rstudio.com>’

  New submission

  Size of tarball: 7138656 bytes
  * checking installed package size ... NOTE
    installed size is  7.4Mb
    sub-directories of 1Mb or more:
      doc        1.8Mb
      reactlog   5.4Mb

* Build ID:   reactlog_1.0.0.tar.gz-1c3c90ecafc4469a92e7753d00fabd2b
  Platform:   Fedora Linux, R-devel, clang, gfortran
  R Under development (unstable) (2019-03-13 r76230) -- "Unsuffered Consequences"
  * checking CRAN incoming feasibility ... NOTE
  Maintainer: ‘Barret Schloerke <barret@rstudio.com>’

  New submission

  Size of tarball: 7138656 bytes
  * checking installed package size ... NOTE
    installed size is  7.4Mb
    sub-directories of 1Mb or more:
      doc        1.8Mb
      reactlog   5.4Mb
