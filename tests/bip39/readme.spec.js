import bip39 from 'react-native-bip39'
import proxyquire from 'proxyquire'
import {tryAsync} from '../lib'

test('README example 1', function () {
  // defaults to BIP39 English word list
  let entropy = 'ffffffffffffffffffffffffffffffff'
  let mnemonic = bip39.entropyToMnemonic(entropy)

  expect(mnemonic.toString()).toEqual('zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong')

  // reversible
  expect(bip39.mnemonicToEntropy(mnemonic)).toEqual(entropy)
})

test.skip('README example 2', async function () {

  let stub = {
    randomBytes: function (size) {
      process.extest(1)
      const buf = new Buffer('qwertyuiopasdfghjklzxcvbnm[];,./'.slice(0, size))
      return Promise.resolve(bip39.mnemonicToEntropy(buf))
    }
  }
  let proxiedbip39 = proxyquire('react-native-bip39', stub)

  // mnemonic strength defaults to 128 btests
  let mnemonic = await proxiedbip39.generateMnemonic()
  // expect(mnemonic.toString()).toEqual('imtestate robot frame trophy nuclear regret saddle around inflict case oil spice')
  // expect(bip39.validateMnemonic(mnemonic).toBe(true))
  // proxiedbip39.generateMnemonic().then(mnemonic=>{
  //   expect(mnemonic.toString()).toEqual('imtestate robot frame trophy nuclear regret saddle around inflict case oil spice')
  //   expect(bip39.validateMnemonic(mnemonic).toBe(true))
  // })
})

test('README example 3', function () {
  tryAsync(async () => {
    let mnemonic = 'basket actual'
    let seed = await bip39.mnemonicToSeed(mnemonic)
    let seedHex = await bip39.mnemonicToSeedHex(mnemonic)

    expect(seed.toString('hex')).toEqual(seedHex)
    expect(seedHex).toEqual('5cf2d4a8b0355e90295bdfc565a022a409af063d5365bb57bf74d9528f494bfa4400f53d8349b80fdae44082d7f9541e1dba2b003bcfec9d0d53781ca676651f')
    expect(bip39.validateMnemonic(mnemonic)).toBe(false)
  })

})
