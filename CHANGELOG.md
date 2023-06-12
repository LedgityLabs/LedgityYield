## [1.61.0](https://github.com/ledgity-labs/dapp/compare/v1.60.0...v1.61.0) (2023-06-12)


### Features

* ton of update mostly about LToken, see long description ([95633bf](https://github.com/ledgity-labs/dapp/commit/95633bf4623aa383c4acbd858f46f2fdca8742f2))


### Others

* **deps:** update nextjs monorepo to v13.4.5 ([6fa3d4e](https://github.com/ledgity-labs/dapp/commit/6fa3d4ef3a6ef5c065fda5cf8bdb36d96edb96be))

## [1.60.0](https://github.com/ledgity-labs/dapp/compare/v1.59.0...v1.60.0) (2023-06-11)


### Features

* **investupgradeable:** rename some entities, improve code readability and documentation ([c7c1163](https://github.com/ledgity-labs/dapp/commit/c7c1163fac6d0721cdd92e99c80f9a9a32baaca2))


### Others

* prevent releases that only change hardhat related stuff to trigger a Vercel deploy ([ac4c2b3](https://github.com/ledgity-labs/dapp/commit/ac4c2b38891f189d1f2261885e13db2b337cfe12))

## [1.59.0](https://github.com/ledgity-labs/dapp/compare/v1.58.1...v1.59.0) (2023-06-11)


### Features

* huge contract docs cleanup + rewrite of some code to improve readability and/or efficiency ([29f74bf](https://github.com/ledgity-labs/dapp/commit/29f74bf53537d868f7921418c14dcd6902c83175))


### Others

* **deps:** update dependency @types/react to v18.2.11 ([152e4d0](https://github.com/ledgity-labs/dapp/commit/152e4d00849879a9e869f8fdbd22c8c27f46e266))

## [1.58.1](https://github.com/ledgity-labs/dapp/compare/v1.58.0...v1.58.1) (2023-06-10)


### Fixes

* **home:** fix not well placed hero cube ([6e3f52b](https://github.com/ledgity-labs/dapp/commit/6e3f52baa6f4e383c72dd5ee596b5b8033029521))


### Others

* code and documentation cleanups in UDS3 and APRCheckpoints libraries ([c3fb245](https://github.com/ledgity-labs/dapp/commit/c3fb24584666a86a0705e30cb8ed9a544d9aba65))
* prevent hardhat related stuff to trigger Vercel redeploy ([8880108](https://github.com/ledgity-labs/dapp/commit/88801086aa1ea4bd95f6f5d37108ad32b862e22d))

## [1.58.0](https://github.com/ledgity-labs/dapp/compare/v1.57.1...v1.58.0) (2023-06-10)


### Features

* **home:** scale down glow image + background color adjustment ([5b37d19](https://github.com/ledgity-labs/dapp/commit/5b37d197059d1e6d5f2ac121a98073ef6d9d6e5d))

## [1.57.1](https://github.com/ledgity-labs/dapp/compare/v1.57.0...v1.57.1) (2023-06-10)


### Fixes

* fix some accessibility issues (no name links & viewport maximum scale < 5) ([ad15c77](https://github.com/ledgity-labs/dapp/commit/ad15c7765da4a565b09e9f12a9c9eb3f9653adc6))

## [1.57.0](https://github.com/ledgity-labs/dapp/compare/v1.56.0...v1.57.0) (2023-06-10)


### Features

* add a ton of page metadata to improve experience on referrers ([bb4ead1](https://github.com/ledgity-labs/dapp/commit/bb4ead19676982547df4ddcaca46a7ec579c096b))


### Others

* remove usage of UDS3 where it wasn't required ([f7668a6](https://github.com/ledgity-labs/dapp/commit/f7668a6b44717a4863cd48906f577783d82a949e))

## [1.56.0](https://github.com/ledgity-labs/dapp/compare/v1.55.0...v1.56.0) (2023-06-09)


### Features

* **ltoken:** refactory exceeding funds transfering in a function + implement it also in _withdrawTo ([9ca5c08](https://github.com/ledgity-labs/dapp/commit/9ca5c08e2c7a0a3c1e25e0532086f0c175f930b1))

## [1.55.0](https://github.com/ledgity-labs/dapp/compare/v1.54.1...v1.55.0) (2023-06-09)


### Features

* **ltoken:** improve contract's resiliency by using SafeERC20 library to interact with underlying ([1bd185b](https://github.com/ledgity-labs/dapp/commit/1bd185b704817096888cb020481501ef1d9ba880))


### Others

* move LTY staking tiers to LTYStaking contract + add isEligibleTo() helper function ([cd2c10e](https://github.com/ledgity-labs/dapp/commit/cd2c10e333c0934c8ff754dd9cc7d0c3f941f928))

## [1.54.1](https://github.com/ledgity-labs/dapp/compare/v1.54.0...v1.54.1) (2023-06-09)


### Fixes

* **home:** add webkit mask position to support chrome and co ([6254542](https://github.com/ledgity-labs/dapp/commit/625454210268dac04bf9ee5c3cfaf7ccbd1b64d1))

## [1.54.0](https://github.com/ledgity-labs/dapp/compare/v1.53.0...v1.54.0) (2023-06-09)


### Features

* **home:** animations and reponsive adjustments ([52ee196](https://github.com/ledgity-labs/dapp/commit/52ee1964df9671dda7e81049c106cdea775f0931))

## [1.53.0](https://github.com/ledgity-labs/dapp/compare/v1.52.0...v1.53.0) (2023-06-09)


### Features

* **home:** a ton of responsive adjustments ([4e02387](https://github.com/ledgity-labs/dapp/commit/4e02387d75ec55e0ce3cc33e612690703b326542))

## [1.52.0](https://github.com/ledgity-labs/dapp/compare/v1.51.1...v1.52.0) (2023-06-08)


### Features

* **home:** adjust glows on mobile screens ([de252bd](https://github.com/ledgity-labs/dapp/commit/de252bdc5549158a0a9e88c1dec0a9f1d839f25b))

## [1.51.1](https://github.com/ledgity-labs/dapp/compare/v1.51.0...v1.51.1) (2023-06-08)


### Fixes

* **home:** prevent "?" of CTA title to wrap alone ([0c0220b](https://github.com/ledgity-labs/dapp/commit/0c0220b57a982696c889d833ab9c49fb1909c827))

## [1.51.0](https://github.com/ledgity-labs/dapp/compare/v1.50.0...v1.51.0) (2023-06-08)


### Features

* **home:** wrap CTA title on xs screens ([afd6a4e](https://github.com/ledgity-labs/dapp/commit/afd6a4ee8b93a025740d1cd8680fa619f4d19e49))

## [1.50.0](https://github.com/ledgity-labs/dapp/compare/v1.49.2...v1.50.0) (2023-06-08)


### Features

* **home:** cleanups and tiny adjustments ([14f6252](https://github.com/ledgity-labs/dapp/commit/14f62529813a153d0dd5e685b338100b974833f2))

## [1.49.2](https://github.com/ledgity-labs/dapp/compare/v1.49.1...v1.49.2) (2023-06-08)


### Fixes

* **home:** fix rendering on Safary mobile ([5894468](https://github.com/ledgity-labs/dapp/commit/5894468b1c4bf3a0007facf37576b671e18e8711))

## [1.49.1](https://github.com/ledgity-labs/dapp/compare/v1.49.0...v1.49.1) (2023-06-08)


### Fixes

* fix typeform buttons and Learn more button ([5cfe604](https://github.com/ledgity-labs/dapp/commit/5cfe604b4e9a0de3854985ff86b359f067a4bd17))

## [1.49.0](https://github.com/ledgity-labs/dapp/compare/v1.48.0...v1.49.0) (2023-06-08)


### Features

* **home:** re-enable FadeIn and disable it on small screens ([2cf5573](https://github.com/ledgity-labs/dapp/commit/2cf5573562e911663b28053b44d2a2210e35f2dd))

## [1.48.0](https://github.com/ledgity-labs/dapp/compare/v1.47.1...v1.48.0) (2023-06-08)


### Features

* disable hero animation on mobile screens ([8fc3328](https://github.com/ledgity-labs/dapp/commit/8fc332831650d815827e02c4c07779a0650a8837))

## [1.47.1](https://github.com/ledgity-labs/dapp/compare/v1.47.0...v1.47.1) (2023-06-08)


### Fixes

* **home:** fix glows on small screens + cubes' hoverring ([08b8e87](https://github.com/ledgity-labs/dapp/commit/08b8e870b74f07fd034034dd35418e935382d15e))

## [1.47.0](https://github.com/ledgity-labs/dapp/compare/v1.46.2...v1.47.0) (2023-06-08)


### Features

* **home:** re-enable hero section animation ([d37b7dc](https://github.com/ledgity-labs/dapp/commit/d37b7dcf0def72479c557fc1ebc8acb68c7dc0f9))

## [1.46.2](https://github.com/ledgity-labs/dapp/compare/v1.46.1...v1.46.2) (2023-06-08)


### Fixes

* fix horizontal scroll on small screens + defer typeform script ([06699f8](https://github.com/ledgity-labs/dapp/commit/06699f82fadd8a67db37e2e79718c14222a7b167))

## [1.46.1](https://github.com/ledgity-labs/dapp/compare/v1.46.0...v1.46.1) (2023-06-08)


### Fixes

* remove unused fonts groups ([39d7419](https://github.com/ledgity-labs/dapp/commit/39d7419402428df5d8d026b18f4a710149144f74))

## [1.46.0](https://github.com/ledgity-labs/dapp/compare/v1.45.1...v1.46.0) (2023-06-08)


### Features

* **home:** update glows images in webp ([972f1da](https://github.com/ledgity-labs/dapp/commit/972f1da2d77aaf363496feb071ee20ab3b40a24a))


### Others

* update hardhat-related dependencies to support Ethers v6 + some contract fixes ([6dfc5b3](https://github.com/ledgity-labs/dapp/commit/6dfc5b370e9f53a30a3ba384d75aa6bae2df0e6d))

## [1.45.1](https://github.com/ledgity-labs/dapp/compare/v1.45.0...v1.45.1) (2023-06-08)


### Others

* refactor the FadeIn animation in its own component ([3a99be0](https://github.com/ledgity-labs/dapp/commit/3a99be0900b3d4f2ae40ea2d8861c2c439e5f88f))


### Fixes

* **home:** fix fadein animation on small screens ([afbac31](https://github.com/ledgity-labs/dapp/commit/afbac314fdca5c66d55652a29ca526ab127cacbb))

## [1.45.0](https://github.com/ledgity-labs/dapp/compare/v1.44.0...v1.45.0) (2023-06-08)


### Features

* randomly reverse cubes spinning, refactor cubes in their own components ([1677583](https://github.com/ledgity-labs/dapp/commit/167758333a68ba112a5fb096714e2778e6d847fb))

## [1.44.0](https://github.com/ledgity-labs/dapp/compare/v1.43.0...v1.44.0) (2023-06-08)


### Features

* upload new og image ([d2d0168](https://github.com/ledgity-labs/dapp/commit/d2d0168bec4fc71866673cbd8f4c213bdae6520f))

## [1.43.0](https://github.com/ledgity-labs/dapp/compare/v1.42.0...v1.43.0) (2023-06-08)


### Features

* optimize assets (some of them are used as bg as so not optimized by NextJS automatically) ([bf4d3b2](https://github.com/ledgity-labs/dapp/commit/bf4d3b224a48593660f3918fb157f8cc017070bd))

## [1.42.0](https://github.com/ledgity-labs/dapp/compare/v1.41.0...v1.42.0) (2023-06-08)


### Features

* open typeform on whitepaper button click ([70a143f](https://github.com/ledgity-labs/dapp/commit/70a143f8d1adc2f61f872661d56746507aae21d1))

## [1.41.0](https://github.com/ledgity-labs/dapp/compare/v1.40.0...v1.41.0) (2023-06-08)


### Features

* **home:** add delubac partner, fix some typo and missing links ([0005133](https://github.com/ledgity-labs/dapp/commit/0005133efa70f4f4d82f50d2a31c6e3b65ebf49b))


### Others

* **deps:** update dependency @types/react to v18.2.9 ([ec182d1](https://github.com/ledgity-labs/dapp/commit/ec182d14effc7a8fccd506039338959352468c0b))
* **deps:** update dependency conventional-changelog-conventionalcommits to v6 ([33deeeb](https://github.com/ledgity-labs/dapp/commit/33deeeb48afd97ec0edce18ed85183576d445b46))

## [1.40.0](https://github.com/ledgity-labs/dapp/compare/v1.39.0...v1.40.0) (2023-06-08)


### Features

* upload opengraph-image.jpg ([e3db830](https://github.com/ledgity-labs/dapp/commit/e3db83079791ab822707b35a0e50e9d3521578b9))


### Others

* update dependencies ([11c02bb](https://github.com/ledgity-labs/dapp/commit/11c02bb9f807d55005a2a2516aa9b2a125b4acb9))

## [1.39.0](https://github.com/ledgity-labs/dapp/compare/v1.38.0...v1.39.0) (2023-06-08)


### Features

* **contracts:** a ton of progress about contracts, see description ([dbe04a9](https://github.com/ledgity-labs/dapp/commit/dbe04a9fe705e523aa4cd706b6ed830f0078d53f))
* implement "No liquidations" feature's illustration ([a8104f0](https://github.com/ledgity-labs/dapp/commit/a8104f0e728bb61576c08724a2b95f74e8d88065))


### Others

* **contracts:** refact Blacklist stuff in an abstract Blacklistable contract ([5886801](https://github.com/ledgity-labs/dapp/commit/58868011b49351cc1c22908d39dce687648b8bff))

## [1.38.0](https://github.com/ledgity-labs/dapp/compare/v1.37.0...v1.38.0) (2023-06-06)


### Features

* refactor APRCheckpoints stuff into a library and implement blacklist in LTYStaking contract ([053aa3a](https://github.com/ledgity-labs/dapp/commit/053aa3a4d4611152e384e7ee0d6d572d72a67908))


### Others

* **deps:** update dependency eslint to v8.42.0 ([d8e035a](https://github.com/ledgity-labs/dapp/commit/d8e035a8fe72b5ab18ec82a4bc94768fa9e712b9))


### Fixes

* fix ui/ page missing "use client"; statement ([63517f2](https://github.com/ledgity-labs/dapp/commit/63517f2173b12baab9094b4ba061a8c4dffcc126))
* fix warning caused by mixed default and names exports in UI components ([ad790a6](https://github.com/ledgity-labs/dapp/commit/ad790a65ff2068a00d8cdc5f0193524067a92416))

## [1.37.0](https://github.com/ledgity-labs/dapp/compare/v1.36.0...v1.37.0) (2023-06-06)


### Features

* **contracts:** setup hardhat and write a first version of L-Token, LTY staking and blacklist contr ([a72b996](https://github.com/ledgity-labs/dapp/commit/a72b9962b4ca591b0b8cfd5a0b56820f4264710b))

## [1.36.0](https://github.com/ledgity-labs/dapp/compare/v1.35.0...v1.36.0) (2023-06-02)


### Features

* add padding to whitepaper CTA to prevent it reaching screen border on small devices ([e5ef49f](https://github.com/ledgity-labs/dapp/commit/e5ef49f6a777043712387e86ee3c07b1c9ba41a7))


### Others

* **deps:** update dependency @types/react to v18.2.8 ([c00e24c](https://github.com/ledgity-labs/dapp/commit/c00e24cf1e4ad81cd6eafd9b376e9eee9d70a9e8))
* **deps:** update dependency typescript to v5.1.3 ([0666440](https://github.com/ledgity-labs/dapp/commit/0666440f9bb2447a7dcf064a1b8cb717c3857936))

## [1.35.0](https://github.com/ledgity-labs/dapp/compare/v1.34.0...v1.35.0) (2023-06-02)


### Features

* **home:** add new hero stats design for xs devices ([5327626](https://github.com/ledgity-labs/dapp/commit/53276267638c8b47338d59f4d0631dd279f7d475))
* improve hero heading display by wrapping words on xs screens and auto-resizing heading ([e5993cb](https://github.com/ledgity-labs/dapp/commit/e5993cb851551b486278775cf6f6c1f82d511607))

## [1.34.0](https://github.com/ledgity-labs/dapp/compare/v1.33.0...v1.34.0) (2023-06-02)


### Features

* decrease z-index of cubes + add backdrop blur to outline buttons for smooth effect ([70c98f2](https://github.com/ledgity-labs/dapp/commit/70c98f27ebb6a1af0ad851d285d4c3ae7ba3f188))
* **home:** reposition and hide some cubes on sm and md devices ([50bbc23](https://github.com/ledgity-labs/dapp/commit/50bbc233d52685197113a2d1546f97af479f34f9))

## [1.33.0](https://github.com/ledgity-labs/dapp/compare/v1.32.0...v1.33.0) (2023-06-01)


### Features

* hide and move some cubes on lg screen compared to xl ones ([6e67710](https://github.com/ledgity-labs/dapp/commit/6e67710aa84694110bb12bd3f1bc2f5a2feda5c4))
* **home:** add more cubes + add webkit mask properties to support chrome browser ([ec69d22](https://github.com/ledgity-labs/dapp/commit/ec69d22701ca0a9c96158484231a1ba1c7c427dd))

## [1.32.0](https://github.com/ledgity-labs/dapp/compare/v1.31.0...v1.32.0) (2023-06-01)


### Features

* add animated subtle animated cubes ([4a45632](https://github.com/ledgity-labs/dapp/commit/4a456324750268d646744badf1bd9b98794fb6d1))
* **home:** add fadein to other home sections ([f1059ec](https://github.com/ledgity-labs/dapp/commit/f1059ec482404b6d04c07b05f6d1a39e4d02e159))

## [1.31.0](https://github.com/ledgity-labs/dapp/compare/v1.30.0...v1.31.0) (2023-06-01)


### Features

* adjust animation + make it appears correctly on devices smaller than 900px width ([9500c22](https://github.com/ledgity-labs/dapp/commit/9500c22f0413c5cd966115d39c152daf815967f0))

## [1.30.0](https://github.com/ledgity-labs/dapp/compare/v1.29.0...v1.30.0) (2023-06-01)


### Features

* **home:** add animation while scrolling from hero to features ([f0fb30d](https://github.com/ledgity-labs/dapp/commit/f0fb30d96c14fdd7b4caec9808e659a7270bcd90))

## [1.29.0](https://github.com/ledgity-labs/dapp/compare/v1.28.0...v1.29.0) (2023-06-01)


### Features

* make the "Learn more" button functional + install Framer Motion ([94f556c](https://github.com/ledgity-labs/dapp/commit/94f556c55d3155edab6fe13077206bba8a26f464))

## [1.28.0](https://github.com/ledgity-labs/dapp/compare/v1.27.0...v1.28.0) (2023-06-01)


### Features

* add hover effect to logo ([79464b9](https://github.com/ledgity-labs/dapp/commit/79464b982b7ee8e77467b66d50e2f21757e6b22a))
* bunch of tiny spacing and contrast adjustments ([96a9e75](https://github.com/ledgity-labs/dapp/commit/96a9e755b3444cd1c9d952165dfdce9844e99d46))
* enforce global transition duration ([8ee34c8](https://github.com/ledgity-labs/dapp/commit/8ee34c8d0480e199723157fcb4fe5a0fb002632e))
* tiny adjustments on How it works section ([4580578](https://github.com/ledgity-labs/dapp/commit/458057801cf2752bf79511117faf6fc5e696311a))

## [1.27.0](https://github.com/ledgity-labs/dapp/compare/v1.26.1...v1.27.0) (2023-06-01)


### Features

* add social links URLs ([ea32eae](https://github.com/ledgity-labs/dapp/commit/ea32eae0ed2a5810234afc73e9811f2feb19525a))
* integrate typeform to retrieve emails until app is available ([a7a55c5](https://github.com/ledgity-labs/dapp/commit/a7a55c5653487e6794d3e6518e9362c1b0a82549))


### Others

* **deps:** update dependency postcss to v8.4.24 ([4fa2ebd](https://github.com/ledgity-labs/dapp/commit/4fa2ebda5bdb339a347bd3bf90a375f4edbaf63e))


### Fixes

* remove margin gap right before footer ([0c1e908](https://github.com/ledgity-labs/dapp/commit/0c1e908ace8050da59290c7ca2700dd3a226912a))

## [1.26.1](https://github.com/ledgity-labs/dapp/compare/v1.26.0...v1.26.1) (2023-06-01)


### Others

* **deps:** update dependency @types/react to v18.2.7 ([4a0779d](https://github.com/ledgity-labs/dapp/commit/4a0779d751c640533e2a47074e886566f53db8d7))
* **deps:** update nextjs monorepo to v13.4.4 ([187f3ed](https://github.com/ledgity-labs/dapp/commit/187f3edda8e6531528132debd93cbf24c1d5a3e3))


### Fixes

* **deps:** update dependency @t3-oss/env-nextjs to ^0.4.0 ([608dc76](https://github.com/ledgity-labs/dapp/commit/608dc7649c72e13840fd846f774b88b6ac53d10b))

## [1.26.0](https://github.com/ledgity-labs/dapp/compare/v1.25.0...v1.26.0) (2023-06-01)


### Features

* make "How it works?" section responsive ([088024a](https://github.com/ledgity-labs/dapp/commit/088024aabe1a713b502ef4c325481d234b17cb83))
* new version of "How it works?" section of home page ([bf464b8](https://github.com/ledgity-labs/dapp/commit/bf464b820507b1af000ad3b18fd3dccde2b48890))
* refactor logo in its own component + improve its readability on light theme ([4777f4c](https://github.com/ledgity-labs/dapp/commit/4777f4c5de72bd88d80bba50518a49159ea13c7c))


### Fixes

* fix background gap at the bottom of home page ([f638160](https://github.com/ledgity-labs/dapp/commit/f638160cca58f87923f25cf25d147632b13c2f1c))

## [1.25.0](https://github.com/ledgity-labs/dapp/compare/v1.24.0...v1.25.0) (2023-05-31)


### Features

* a bunch of tiny readability and reading priority improvements ([056c438](https://github.com/ledgity-labs/dapp/commit/056c4380ee14633a5b5e945d339cf112c8538d7e))
* add subtle radial gradients to features cards texts to improve readability ([30a4e07](https://github.com/ledgity-labs/dapp/commit/30a4e07a5661c7c52c1ebba21d964ab8cbbcbb00))
* some graphical adjustments to cards and illustrations to improve hover effect and readability ([86f901a](https://github.com/ledgity-labs/dapp/commit/86f901a14387e51a8f6f678020d6a9d8ee9b699f))

## [1.24.0](https://github.com/ledgity-labs/dapp/compare/v1.23.1...v1.24.0) (2023-05-31)


### Features

* makes features cards animated on hover ([a708b04](https://github.com/ledgity-labs/dapp/commit/a708b04808e94c925ca49dcd9f118e1c346f87ce))
* upload new features cards' illustrations and texts ([53021ea](https://github.com/ledgity-labs/dapp/commit/53021ea6f0235c5f41d8737f467ef2855ed48f6d))


### Others

* **deps:** update dependency eslint to v8.41.0 ([9a127c1](https://github.com/ledgity-labs/dapp/commit/9a127c1c41de7a70502d6058b79695c0d7bb83ca))
* **deps:** update nextjs monorepo to v13.4.3 ([7bd7042](https://github.com/ledgity-labs/dapp/commit/7bd70422465ecb5e105d6b30f73bbbd528a34b5a))

## [1.23.1](https://github.com/ledgity-labs/dapp/compare/v1.23.0...v1.23.1) (2023-05-22)


### Fixes

* tiny adjustments about responsivness ([cf877ef](https://github.com/ledgity-labs/dapp/commit/cf877ef2317cdb296b0810a3c5dc4e502651ee50))

## [1.23.0](https://github.com/ledgity-labs/dapp/compare/v1.22.0...v1.23.0) (2023-05-22)


### Features

* **home:** make features cards and "how it works?" section responsive ([b3e218e](https://github.com/ledgity-labs/dapp/commit/b3e218e6faeef174281ab69d0568fb5ef8ebb723))
* **home:** make partners section responsive ([26c50c6](https://github.com/ledgity-labs/dapp/commit/26c50c60af0dd7361aa103c768ed03c342b86712))
* make footer responsive ([0c42188](https://github.com/ledgity-labs/dapp/commit/0c421889410e594a35f9398441011049f00fcc1a))

## [1.22.0](https://github.com/ledgity-labs/dapp/compare/v1.21.0...v1.22.0) (2023-05-22)


### Features

* first version of footer ([8c18d1a](https://github.com/ledgity-labs/dapp/commit/8c18d1a07e61e41f8028b7255a9e5141beb18b72))
* make header and hero responsive ([bbe0e27](https://github.com/ledgity-labs/dapp/commit/bbe0e27e31b527a6ae45338e564426b690e74fce))

## [1.21.0](https://github.com/ledgity-labs/dapp/compare/v1.20.0...v1.21.0) (2023-05-18)


### Features

* **home:** add partners section ([05f4fac](https://github.com/ledgity-labs/dapp/commit/05f4facf39c50f385f1bbb3155da9ada9aad3bd0))
* **home:** increase spacing between section and add hover effect to partners logos ([7320c3d](https://github.com/ledgity-labs/dapp/commit/7320c3d71015d761eadce1fd35f7468ace1c52ed))
* **home:** progessively hide scroll indicator onscroll ([aca3dbb](https://github.com/ledgity-labs/dapp/commit/aca3dbb5d9823083d92b14041e8c1338314c18d1))
* **home:** tiny adjustments, new CTA, mono-column "How it works?" section ([ab3a02b](https://github.com/ledgity-labs/dapp/commit/ab3a02b17aa7f76e5878ee6ee64e23dff1173fd1))

## [1.20.0](https://github.com/ledgity-labs/dapp/compare/v1.19.0...v1.20.0) (2023-05-18)


### Features

* **home:** improve feature card appearance + new glow asset (used as background for home body) ([bdb864d](https://github.com/ledgity-labs/dapp/commit/bdb864d7aa87e6b454da11ae7808bb711dcd604d))

## [1.19.0](https://github.com/ledgity-labs/dapp/compare/v1.18.0...v1.19.0) (2023-05-18)


### Features

* **home:** a bunch of home page updates (hero transition, CSS replaced by tailwind, new glow, ...) ([9ba4b14](https://github.com/ledgity-labs/dapp/commit/9ba4b145a7765a5da61c80c3f7b0723a2014992e))

## [1.18.0](https://github.com/ledgity-labs/dapp/compare/v1.17.0...v1.18.0) (2023-05-17)


### Features

* add radius-based variants of <Card/> component ([888915b](https://github.com/ledgity-labs/dapp/commit/888915b31418a39e66b5681a38d0a7f2a3b0bca7))
* **ui:** add new <Card/> radius variant to UI kit page ([f62064d](https://github.com/ledgity-labs/dapp/commit/f62064d79437478c4dc339f2cae319e8ac313995))


### Fixes

* fix deployment error + some text typos ([26ac08f](https://github.com/ledgity-labs/dapp/commit/26ac08fcf6daa2f76097e11f20c89ddaefd8770e))

## [1.17.0](https://github.com/ledgity-labs/dapp/compare/v1.16.0...v1.17.0) (2023-05-17)


### Features

* **home:** add a minimal Footer component and implement it on layout ([2ae8fca](https://github.com/ledgity-labs/dapp/commit/2ae8fcabf4c489316abc971ccd3d043e7e71aff9))
* **home:** first version of "How it works?" section ([41c8a16](https://github.com/ledgity-labs/dapp/commit/41c8a161eb4f3e0b748886fa8e985ec0cf696c6e))

## [1.16.0](https://github.com/ledgity-labs/dapp/compare/v1.15.0...v1.16.0) (2023-05-17)


### Features

* **card:** add subtle glow to card content also + enable turbopack ([cd20b5d](https://github.com/ledgity-labs/dapp/commit/cd20b5d0bb555e0b90fd2cdeeca5201dfc34a2e4))

## [1.15.0](https://github.com/ledgity-labs/dapp/compare/v1.14.0...v1.15.0) (2023-05-17)


### Features

* **home:** first version of feature cards ([42f65e7](https://github.com/ledgity-labs/dapp/commit/42f65e7fa9d34519a9902cac5b4d87c0b5a33524))

## [1.14.0](https://github.com/ledgity-labs/dapp/compare/v1.13.0...v1.14.0) (2023-05-17)


### Features

* add favicon + replace usage of deprecated next/head by metadata API ([43af5f2](https://github.com/ledgity-labs/dapp/commit/43af5f20c7881ff3e6494aca88fa738b58b9c3fe))
* **header:** add a blured transparent background to header when scrollY is not at the very top ([efa0384](https://github.com/ledgity-labs/dapp/commit/efa0384032e1342afa5184a201a364ce755e46c5))


### Fixes

* fix ui page that were still relying on old card component + clean unused cards variants ([8da4b86](https://github.com/ledgity-labs/dapp/commit/8da4b8675c5a9f63c7c4e3e545d4562df1e37c2f))

## [1.13.0](https://github.com/ledgity-labs/dapp/compare/v1.12.0...v1.13.0) (2023-05-17)


### Features

* **cardshelper:** make the CardsHelper working on page change and improve its performances ([da352c9](https://github.com/ledgity-labs/dapp/commit/da352c9871fd3c19e25f6449409b190f48795333))


### Others

* cleanup unused backgroundImages in tailwind.config.js + remove old Card component ([2e5d5dc](https://github.com/ledgity-labs/dapp/commit/2e5d5dc5bf6c6c9dfe2396c92f145fab24ea7ebe))
* remove now unused stuff from Card component ([1025301](https://github.com/ledgity-labs/dapp/commit/1025301ec7f6058e1845736f31f5d39c98d3f2f3))

## [1.12.0](https://github.com/ledgity-labs/dapp/compare/v1.11.0...v1.12.0) (2023-05-17)


### Features

* **home:** a bunch of home page related features (see long description) ([5221c4a](https://github.com/ledgity-labs/dapp/commit/5221c4a7d65b9ef9e51c5eb47c0bfd12cd9b4789))

## [1.11.0](https://github.com/ledgity-labs/dapp/compare/v1.10.0...v1.11.0) (2023-05-16)


### Features

* **components:** add a tiny delay to Card glow movement and improvement CardsHelper performances ([2c000dc](https://github.com/ledgity-labs/dapp/commit/2c000dc7a4753a34b28525c4992a7c6158dc7c46))

## [1.10.0](https://github.com/ledgity-labs/dapp/compare/v1.9.0...v1.10.0) (2023-05-16)


### Features

* **components:** add first version of Cards glow effect ([9c0c58a](https://github.com/ledgity-labs/dapp/commit/9c0c58a5df0d1eabc73d9aaeeda584964b2e07c4))
* **components:** add style to the 2 Card components variants ([2966ef4](https://github.com/ledgity-labs/dapp/commit/2966ef48a697ca01ea346da72bc3e6f422384167))
* **home:** add empty features boxes ([49ebff5](https://github.com/ledgity-labs/dapp/commit/49ebff551041ff55c8971f6ecd91c9b6b9797e63))
* **ui:** improve the cards display in ui kit page ([a34639a](https://github.com/ledgity-labs/dapp/commit/a34639a0578c2806c5624d25e84f478d40f81f6a))

## [1.9.0](https://github.com/ledgity-labs/dapp/compare/v1.8.0...v1.9.0) (2023-05-16)


### Features

* **components:** add Card component outline ([a6c1a7d](https://github.com/ledgity-labs/dapp/commit/a6c1a7da972b083fdb1f701435a3f40601bc99ea))
* **home:** slightly reduce glow-light.png opacity ([6274619](https://github.com/ledgity-labs/dapp/commit/62746199feb0eac5e9fce750694bd0814211772b))
* **ui:** add Card component to the ui kit page ([174718b](https://github.com/ledgity-labs/dapp/commit/174718bb95d92339bad4299120e136bd8d3a1b54))

## [1.8.0](https://github.com/ledgity-labs/dapp/compare/v1.7.0...v1.8.0) (2023-05-15)


### Features

* **home:** make subtle glow more intense as well as tagline text gradient ([3876fda](https://github.com/ledgity-labs/dapp/commit/3876fda25cba6f5829ffe85184ddb998559aa492))

## [1.7.0](https://github.com/ledgity-labs/dapp/compare/v1.6.0...v1.7.0) (2023-05-15)


### Features

* **home:** temporarily remove header backdrop blur effect for a more immersive experience ([81d5467](https://github.com/ledgity-labs/dapp/commit/81d5467985a9a1b11d5b6b35b204c4fd84635664))

## [1.6.0](https://github.com/ledgity-labs/dapp/compare/v1.5.0...v1.6.0) (2023-05-15)


### Features

* center a bit more home tagline + tiny improvements on redability and maintainability ([abaffae](https://github.com/ledgity-labs/dapp/commit/abaffae2f95ba56f483c25ed71bf02e897a5941d))
* **home:** add a subtle top-right gradient effect to "real world assets" in tagline ([6a96b32](https://github.com/ledgity-labs/dapp/commit/6a96b323ff50454b74a35eb3f2fc66476bb2a2b2))
* **home:** add repeated radial gradient effect + makes stats cards more blurry and visible ([fbcd236](https://github.com/ledgity-labs/dapp/commit/fbcd236c4a82bc242f7afea066fdd229cf071b8a))

## [1.5.0](https://github.com/ledgity-labs/dapp/compare/v1.4.0...v1.5.0) (2023-05-15)


### Features

* improve home page by adding CTAs + elegant background glows ([22ab112](https://github.com/ledgity-labs/dapp/commit/22ab11291290259632d47a0e429ec544263d8ec6))

## [1.4.0](https://github.com/ledgity-labs/dapp/compare/v1.3.0...v1.4.0) (2023-05-15)


### Features

* improve <Button/> component usability using forwardRef and React.HTMLAttributes ([0422023](https://github.com/ledgity-labs/dapp/commit/0422023ab90014dd2c756c49338f887ba0bac7c7))


### Others

* include all types of commits into generated changelogs ([26654b9](https://github.com/ledgity-labs/dapp/commit/26654b98cf08b67acddd31be492c5e2ab7b5d5cd))

# [1.3.0](https://github.com/ledgity-labs/dapp/compare/v1.2.0...v1.3.0) (2023-05-14)


### Bug Fixes

* import alias prefix in api/score route.ts ([48bb83c](https://github.com/ledgity-labs/dapp/commit/48bb83ccdc97330d1922d93bec28f01a6659b1ed))


### Features

* add a minimal hero on home page ([8e98105](https://github.com/ledgity-labs/dapp/commit/8e9810529f58ae6555958b4eb5330f5239f6f82b))
* import assets and add a minimal header for outside app layout ([1f21b8e](https://github.com/ledgity-labs/dapp/commit/1f21b8ec4c11cd569b55ddc9bdb5040a39243b06))
* improve header logo alignment + refactor this one in its own component ([cfdcd1f](https://github.com/ledgity-labs/dapp/commit/cfdcd1f667fef6bb0152bac0ce4d1bafa0723645))

# [1.2.0](https://github.com/ledgity-labs/dapp/compare/v1.1.1...v1.2.0) (2023-05-13)


### Features

* a bunch of UI-related features (see commit long description) ([e0d8929](https://github.com/ledgity-labs/dapp/commit/e0d8929ccf2f7a4d94804bfc70da91eaec11dcde))
* **ui:** setup a minimal ui kit page ([b267377](https://github.com/ledgity-labs/dapp/commit/b2673772488c50769bd8ef026eabe71f92f15f6f))

## [1.1.1](https://github.com/ledgity-labs/dapp/compare/v1.1.0...v1.1.1) (2023-05-13)

### Bug Fixes

- fix Eslint config and apply Eslint recommandations ([bdeae33](https://github.com/ledgity-labs/dapp/commit/bdeae33f74dffe207c860ca33e71f6545c016705))

# 1.0.0 (2023-05-11)

### Features

- add minimal loading and error pages ([8d6fea1](https://github.com/ledgity-labs/dapp/commit/8d6fea1a5425cb0bc80654ae9f1e5e707cb75165))
- minimal project from create-next-app CLI ([add908b](https://github.com/ledgity-labs/dapp/commit/add908b973b5ea52ff419d1f6e3b4a1ff3b43b4a))
- setup minimal app routes skeleton ([83d1e5d](https://github.com/ledgity-labs/dapp/commit/83d1e5dec8758cbfe5095ffef4a6015145221552))
