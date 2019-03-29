## Cran comments

#### 2019-3-18

Reworded the description and added the DOI mid sentenance in the description.
I kept the name inside the parenthesis to avoid confusion, similar to https://CRAN.R-project.org/package=phyclust.
> 'reactlog' (Schloerke 2019) <doi:10.5281/zenodo.2591517> provides a visual insight into...


Thank you for the change and suggestion!

Best,
Barret


#### 2019-3-18

> The Description field should start with a capital letter.

Please fix and resubmit.

Is there some reference about the method you can add in the Description
field in the form Authors (year) <doi:.....>?

Best,
Uwe Ligges


#### 2019-3-17

Hello,

Possible invalid URL:
* The README.md URL (http://www.rpackages.io/package/reactlog) is valid once reactlog is on CRAN.  The webpage works, just the status is a 404.

Single quote packages:
* Changed `Shiny` to `'shiny'` in the DESCRIPTION file.

Omit stock license file:
* Added the License.md file to `.Rbuildignore`.

Thank you for the changes!

Best,
Barret



#### 2019-3-17

Thanks,

   Found the following (possibly) invalid URLs:
     URL: http://www.rpackages.io/package/reactlog
       From: README.md
       Status: 404
       Message: Not Found


Please always write package names, software names and API names in
single quotes (e.g. 'Shiny') in the Title and the Description field.

The LICENSE file is only needed if you have additional restrictions to
the GPL-3 which you have not? In that please case omit the file.

Please fix and resubmit.

Best,
Martina Schmirl


#### 2019-3-14

I've reduced the file size and updated the check outputs below.

Thank you for your time!

Best,
Barret


#### 2019-3-14

Thanks, we see:

   Size of tarball: 7138666 bytes

Not more than 5 MB for a CRAN package, please.

Best,
Uwe Ligges


#### 2019-3-14

This is a new release.

Please let me know if there is anything else I can provide.

Thank you,
Barret


## R CMD check results

Overall there are no consistent notes or warnings other than the note of `reactlog` being a new submission.

0 errors | 0 warnings | 1 note

* NOTES:
  * checking CRAN incoming feasibility ... NOTE
    Maintainer: 'Barret Schloerke <barret@rstudio.com>'
    New submission


False positives:
* The 404 README.md URL (http://www.rpackages.io/package/reactlog) is valid once reactlog is on cran.  The webpage works, just the status is a 404.
* The WARNING for the README.md conversion on rhub is most likely due to rhub's setup.
* The NOTE for window's old release not converting Authors@R consistently.


## Test environments

#### local OS X install, R 3.5.2
* NOTES:
  * checking CRAN incoming feasibility ... NOTE
    Maintainer: 'Barret Schloerke <barret@rstudio.com>'
    New submission

  Found the following (possibly) invalid URLs:
    URL: http://www.rpackages.io/package/reactlog
      From: README.md
      Status: 404
      Message: Not Found
#### ubuntu 14.04 (on travis-ci)

* R 3.4.4 - Status: OK

* R 3.5.2 - Status: OK

* R Under development (unstable) (2019-03-14 r76237) - Status: OK


#### win-builder (devel and release)

* R version 3.4.4 (2018-03-15)
  * checking CRAN incoming feasibility ... NOTE
  Maintainer: 'Barret Schloerke <barret@rstudio.com>'

  New submission

  Found the following (possibly) invalid URLs:
    URL: http://www.rpackages.io/package/reactlog
      From: README.md
      Status: 404
      Message: Not Found
  * checking DESCRIPTION meta-information ... NOTE
  Author field differs from that derived from Authors@R
    Author:    'Barret Schloerke [aut, cre] (<https://orcid.org/0000-0001-9986-114X>), Joe Cheng [ctb], RStudio [cph, fnd]'
    Authors@R: 'Barret Schloerke [aut, cre] (0000-0001-9986-114X), Joe Cheng [ctb], RStudio [cph, fnd]'

* R Under development (unstable) (2019-03-12 r76226)
  * checking CRAN incoming feasibility ... NOTE
  Maintainer: 'Barret Schloerke <barret@rstudio.com>'

  New submission

  Found the following (possibly) invalid URLs:
    URL: http://www.rpackages.io/package/reactlog
      From: README.md
      Status: 404
      Message: Not Found

* R version 3.5.3 (2019-03-11)
  * checking CRAN incoming feasibility ... NOTE
  Maintainer: 'Barret Schloerke <barret@rstudio.com>'

  New submission

  Found the following (possibly) invalid URLs:
    URL: http://www.rpackages.io/package/reactlog
      From: README.md
      Status: 404
      Message: Not Found
#### rhub

* Build ID: reactlog_1.0.0.tar.gz-8f10a076c4d543ee935621494de204a2
  Platform: Windows Server 2008 R2 SP1, R-devel, 32/64 bit
  R Under development (unstable) (2019-03-09 r76216)
  * checking CRAN incoming feasibility ... NOTE
  Maintainer: 'Barret Schloerke <barret@rstudio.com>'

  New submission

* Build ID: reactlog_1.0.0.tar.gz-61464674f5894f2aafbdeb08cde4398e
  Platform: Windows Server 2008 R2 SP1, R-release, 32/64 bit
  R version 3.5.3 (2019-03-11)
  * checking CRAN incoming feasibility ... NOTE
  Maintainer: 'Barret Schloerke <barret@rstudio.com>'
  New submission

* Build ID:   reactlog_1.0.0.tar.gz-6f17d96a1158459d9d1a673bdf970a3d
  Platform:   Ubuntu Linux 16.04 LTS, R-release, GCC
  R version 3.5.3 (2019-03-11) -- "Great Truth"
  * checking top-level files ... WARNING
  Conversion of ‘README.md’ failed:
  (ConnectionFailure getProtocolByName: does not exist (no such protocol name: tcp))
  * checking CRAN incoming feasibility ... NOTE
  Maintainer: ‘Barret Schloerke <barret@rstudio.com>’

  New submission

* Build ID:   reactlog_1.0.0.tar.gz-ce002ac23eac49d0bf288412970c2627
  Platform:   Fedora Linux, R-devel, clang, gfortran
  R Under development (unstable) (2019-03-13 r76230) -- "Unsuffered Consequences"
  * checking CRAN incoming feasibility ... NOTE
  Maintainer: ‘Barret Schloerke <barret@rstudio.com>’

  New submission
