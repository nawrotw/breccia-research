#Build testing
- pre adding ant.d table:
  vite v8.0.0-beta.14 building client environment for production...
  ✓ 1902 modules transformed.
  dist/index.html                       0.45 kB │ gzip:   0.29 kB
  dist/assets/forest-bg-CsxT16zT.svg    4.92 kB │ gzip:   1.28 kB
  dist/assets/index-CgnWdQgw.css       37.50 kB │ gzip:   7.23 kB
  dist/assets/index-ZGRk1UI2.js       496.22 kB │ gzip: 154.28 kB
                               Total: 539.09 kB │ gzip: 163.08 kB

✓ built in 378ms

- with page containing and.d table:
  ✓ 3318 modules transformed.
  dist/index.html                         0.45 kB │ gzip:   0.29 kB
  dist/assets/forest-bg-CsxT16zT.svg      4.92 kB │ gzip:   1.28 kB
  dist/assets/index-C9K6xRTc.css         37.52 kB │ gzip:   7.24 kB
  dist/assets/index-z9brFJch.js       1,126.86 kB │ gzip: 355.93 kB
                               Total: 1,169.75 kB │ gzip: 364.74 kB
  ✓ built in 375ms

- tanstack router => react router: default chunking
  ✓ 3245 modules transformed.
  dist/index.html                         0.45 kB │ gzip:   0.29 kB
  dist/assets/forest-bg-CsxT16zT.svg      4.92 kB │ gzip:   1.28 kB
  dist/assets/index-C9K6xRTc.css         37.52 kB │ gzip:   7.24 kB
  dist/assets/index-DbQP3OhM.js       1,137.49 kB │ gzip: 360.03 kB
                               Total: 1,180.38 kB │ gzip: 368.84 kB

- react-router: lazy
  ✓ 3245 modules transformed.
  dist/index.html                           0.45 kB │ gzip:   0.29 kB
  dist/assets/forest-bg-CsxT16zT.svg        4.92 kB │ gzip:   1.28 kB
  dist/assets/index-C9K6xRTc.css           37.52 kB │ gzip:   7.24 kB
  dist/assets/fetchUsers-CX-MfQ1f.js        0.29 kB │ gzip:   0.21 kB
  dist/assets/checkbox-BYETaAaZ.js          5.06 kB │ gzip:   2.04 kB
  dist/assets/CreateUserPage-DoAfJVkf.js   29.66 kB │ gzip:  10.82 kB
  dist/assets/UsersPage-CY4m7C6D.js        78.18 kB │ gzip:  22.03 kB
  dist/assets/index-8sBr2vx1.js           394.59 kB │ gzip: 126.31 kB
  dist/assets/AntUsersPage-P7XRhYEs.js    630.13 kB │ gzip: 201.93 kB - ANT... bigger than everything else together :rotfl:
                                 Total: 1,180.80 kB │ gzip: 372.15 kB

- ant.d vite manual chunking (but with only Table component, others were switched to shadcn, so adding any other ant.d component will blow size massively :cry):
  ✓ 2521 modules transformed.
  dist/index.html                             0.62 kB │ gzip:   0.34 kB
  dist/assets/forest-bg-CsxT16zT.svg          4.92 kB │ gzip:   1.28 kB
  dist/assets/index-DXnGl7ee.css             38.00 kB │ gzip:   7.30 kB
  dist/assets/fetchUsers-CeurxAuA.js          0.29 kB │ gzip:   0.21 kB
  dist/assets/rolldown-runtime-DF2fYuay.js    0.55 kB │ gzip:   0.35 kB
  dist/assets/label-Be7gdDi9.js               0.72 kB │ gzip:   0.45 kB
  dist/assets/input-o1bpEvKz.js               0.91 kB │ gzip:   0.49 kB
  dist/assets/checkbox-B67ZJg74.js            4.39 kB │ gzip:   1.89 kB
  dist/assets/AntUsersPage-CSZSN-Hl.js        4.75 kB │ gzip:   1.91 kB
  dist/assets/CreateUserPage-C410dUTG.js     29.26 kB │ gzip:  10.67 kB
  dist/assets/UsersPage-DafhfaQ-.js          78.30 kB │ gzip:  22.09 kB
  dist/assets/index-BHIpjjpy.js             204.51 kB │ gzip:  67.11 kB
  dist/assets/vendor-antd-O1IvFMDU.js       750.72 kB │ gzip: 239.61 kB
                                   Total: 1,117.94 kB │ gzip: 353.70 kB
