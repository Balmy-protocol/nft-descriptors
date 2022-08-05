[![Lint](https://github.com/Mean-Finance/nft-descriptors/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/Mean-Finance/nft-descriptors/actions/workflows/lint.yml)
[![Tests](https://github.com/Mean-Finance/nft-descriptors/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/Mean-Finance/nft-descriptors/actions/workflows/tests.yml)
[![Slither Analysis](https://github.com/Mean-Finance/nft-descriptors/actions/workflows/slither.yml/badge.svg?branch=main)](https://github.com/Mean-Finance/nft-descriptors/actions/workflows/slither.yml)

# Mean Finance NFT Descriptors

This repository holds Mean's NFT Descriptors. These are contracts that will generate an SVG completely on-chain, to describe the current state of an NFT.

## Package

The package will contain:

- Artifacts can be found under `@mean-finance/nft-descriptors/artifacts`
- Compatible deployments for [hardhat-deploy](https://github.com/wighawag/hardhat-deploy) plugin under the `@mean-finance/nft-descriptors/deployments` folder.
- Typescript smart contract typings under `@mean-finance/nft-descriptors/typechained`

## Documentation

Everything that you need to know as a developer on how to use all repository smart contracts can be found in the [documented interfaces](./solidity/interfaces/).

## Installation

To install with [**Hardhat**](https://github.com/nomiclabs/hardhat) or [**Truffle**](https://github.com/trufflesuite/truffle):

#### YARN

```sh
yarn add @mean-finance/nft-descriptors
```

### NPM

```sh
npm install @mean-finance/nft-descriptors
```
