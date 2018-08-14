import bip39 from 'react-native-bip39'
import vectors from 'react-native-bip39/test/vectors'
import english from 'react-native-bip39/wordlists/english'
import japanese from 'react-native-bip39/wordlists/japanese'
import custom from 'react-native-bip39/test/wordlist'
import {tryAsync} from '../lib'

const WORDLISTS = {
  english,
  japanese,
  custom,
}

function testVector(description, wordlist, password, v, i) {
  let ventropy = v[0]
  let vmnemonic = v[1]
  let vseedHex = v[2]

  test('for ' + description + '(' + i + '), ' + ventropy, function () {
    async function rng() {
      return new Promise(resolve => {
        resolve(Buffer.from(ventropy, 'hex'))
      })
    }

    tryAsync(async () => {
      expect(bip39.mnemonicToEntropy(vmnemonic, wordlist)).toEqual(ventropy)
      expect(await bip39.mnemonicToSeedHex(vmnemonic, password)).toEqual(vseedHex)
      expect(bip39.entropyToMnemonic(ventropy, wordlist)).toEqual(vmnemonic)

      expect(await bip39.generateMnemonic(undefined, wordlist, rng)).toEqual(vmnemonic)
      expect(bip39.validateMnemonic(vmnemonic, wordlist)).toBe(true)
    })
  })
}


test('exposes standard wordlists', function () {
  expect(bip39.wordlists.EN).toEqual(WORDLISTS.english)
  expect(bip39.wordlists.EN.length).toEqual(2048)
})

describe(`test english vectors`, () => {
  vectors.english.forEach(function (v, i) {
    testVector('English', undefined, 'TREZOR', v, i)
  })
})

describe(`test japanese vectors`, () => {
  vectors.japanese.forEach(function (v, i) {
    testVector('Japanese', WORDLISTS.japanese, '㍍ガバヴァぱばぐゞちぢ十人十色', v, i)
  })
})

describe(`test custom vectors`, () => {
  vectors.custom.forEach(function (v, i) {
    testVector('Custom', WORDLISTS.custom, undefined, v, i)
  })
})

test('UTF8 passwords', function () {
  vectors.japanese.forEach(function (v) {
    let vmnemonic = v[1]
    let vseedHex = v[2]

    let password = '㍍ガバヴァぱばぐゞちぢ十人十色'
    let normalizedPassword = 'メートルガバヴァぱばぐゞちぢ十人十色'

    tryAsync(async () => {
      expect(await bip39.mnemonicToSeedHex(vmnemonic, password)).toEqual(vseedHex)
      expect(await bip39.mnemonicToSeedHex(vmnemonic, normalizedPassword)).toEqual(vseedHex)
    })
  })
})

test('generateMnemonic can lety entropy length', function () {
  tryAsync(async () => {
    let words = await bip39.generateMnemonic(160)
    words = words.split(' ')
    expect(words.length).toEqual(15)
  })
})

// test('generateMnemonic requests the exact amount of data from an RNG', function (t) {
//   t.plan(1)
//
//   bip39.generateMnemonic(160, function (size) {
//     t.equal(size, 160 / 8)
//     return Buffer.allocUnsafe(size)
//   })
// })

test('validateMnemonic', function () {
  expect(bip39.validateMnemonic('sleep kitten')).toBe(false)
  expect(bip39.validateMnemonic('sleep kitten sleep kitten sleep kitten')).toBe(false)
  expect(bip39.validateMnemonic('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about end grace oxygen maze bright face loan ticket trial leg cruel lizard bread worry reject journey perfect chef section caught neither install industry')).toBe(false)
  expect(bip39.validateMnemonic('turtle front uncle idea crush write shrug there lottery flower risky shell')).toBe(false)
  expect(bip39.validateMnemonic('sleep kitten sleep kitten sleep kitten sleep kitten sleep kitten sleep kitten')).toBe(false)
})

