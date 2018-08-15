import React, {Component} from 'react'
import {StyleSheet} from 'react-native'
import {Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title} from 'native-base'
import ethers from 'ethers'
import EthWallet from 'lib/EthWallet'
import {tryAsync2 as tryAsync, wait} from 'utils'

export default class EthersTest extends Component {

  privkeyGeneration = function () {
    let Accounts = require('tests/ethers/data/accounts.json')

    let i = 0, max = Accounts.length, logs = []
    let interval = setInterval(() => {
      if (i >= max) return clearInterval(interval)
      let target = Accounts[i]
      i++
      if (target.privateKey) {
        let wallet = new ethers.Wallet(target.privateKey)
        this.equal(wallet.address.toLowerCase(), target.address.toLowerCase(), `${i}. correctly computes privateKey - ${target.privateKey}`)
      }
      this.progress(i, max)
      this.equal(ethers.utils.getAddress(target.address), target.checksumAddress, `ethers.utils.getAddress(target.address)`)
      this.equal(ethers.utils.getAddress(target.address, true), target.icapAddress, `target.address, true`)
      this.equal(ethers.utils.getAddress(target.checksumAddress), target.checksumAddress, `target.checksumAddress`)
      this.equal(ethers.utils.getAddress(target.checksumAddress, true), target.icapAddress, `target.checksumAddress, true`)
      this.equal(ethers.utils.getAddress(target.icapAddress), target.checksumAddress, `target.icapAddress`)
      this.equal(ethers.utils.getAddress(target.icapAddress, true), target.icapAddress, `target.icapAddress, true`)
    }, 0)
  }

  decryptKeystore = function () {
    const target = {
      'type': 'secret-storage',
      'address': '0x012363d61bdc53d0290a0f25e9c89f8257550fb8',
      'json': '{"address":"012363d61bdc53d0290a0f25e9c89f8257550fb8","id":"5ba8719b-faf9-49ec-8bca-21522e3d56dc","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"bc0473d60284d2d6994bb6793e916d06"},"ciphertext":"e73ed0b0c53bcaea4516a15faba3f6d76dbe71b9b46a460ed7e04a68e0867dd7","kdf":"scrypt","kdfparams":{"salt":"97f0b6e17c392f76a726ceea02bac98f17265f1aa5cf8f9ad1c2b56025bc4714","n":131072,"dklen":32,"p":1,"r":8},"mac":"ff4f2db7e7588f8dd41374d7b98dfd7746b554c0099a6c0765be7b1c7913e1f3"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2018-01-27T01-52-22.0Z--012363d61bdc53d0290a0f25e9c89f8257550fb8","mnemonicCounter":"70224accc00e35328a010a19fef51121","mnemonicCiphertext":"cf835e13e4f90b190052263dbd24b020","version":"0.1"}}',
      'mnemonic': 'service basket parent alcohol fault similar survey twelve hockey cloud walk panel',
      'name': 'ethers1',
      'password': 'password',
      'privateKey': '0x4c94faa2c558a998d10ee8b2b9b8eb1fbcb8a6ac5fd085c6f95535604fc1bffb'
    }

    setTimeout(() => {
      try {
        ethers.Wallet.fromEncryptedWallet(target.json, target.password).then(wallet => {
          this.equal(wallet.privateKey, target.privateKey, 'generated correct private key - ' + wallet.privateKey)
          this.equal(wallet.address.toLowerCase(), target.address, 'generate correct address - ' + wallet.address)
          if (target.mnemonic) {
            this.equal(wallet.mnemonic, target.mnemonic, 'mnemonic enabled encrypted wallet has a mnemonic')
          }
        })
      } catch (e) {
        console.error(e)
      }
    }, 10)
  }

  transactionParse = function () {
    const target = {
      'accountAddress': '0x9db232a9a8c20c430c7d7d3390a9d9190ae661d5',
      'name': 'random-140',
      'privateKey': '0x0e9c5467df1c692fa528f351bcce45c1e9d8c895b8f780aa364e316f4cfc711b',
      'unsignedTransaction': '0xee6582cb2a88294d0582492ceffd945f3462a4a4acdf4ea5dd57935ff1c0d4b2855b9e8740d33b601312d9801c8080',
      'unsignedTransactionChainId5': '0xee6582cb2a88294d0582492ceffd945f3462a4a4acdf4ea5dd57935ff1c0d4b2855b9e8740d33b601312d9801c8080',
      'signedTransaction': '0xf86e6582cb2a88294d0582492ceffd945f3462a4a4acdf4ea5dd57935ff1c0d4b2855b9e8740d33b601312d9801ca0d4b94d3c748bdda0fb64b5f4da650992609d36091db55f707c41e3b067f14f6fa0681f944073a6f52d46859113dd530440fd594994a56e8d7d8daf5db62daea400',
      'signedTransactionChainId5': '0xf86e6582cb2a88294d0582492ceffd945f3462a4a4acdf4ea5dd57935ff1c0d4b2855b9e8740d33b601312d9802da003de35ad77cf9047a7ade036a4c599d6fd296f3f7958b50af23bd0b2eda66c74a003a332d575cfcaff960bdd0e8ea33c7504ef408597bdc1906c26f443d0757939',
      'to': '0x5f3462a4a4acdf4ea5dd57935ff1c0d4b2855b9e',
      'data': '0x',
      'gasLimit': '0x294d0582492ceffd',
      'gasPrice': '0xcb2a',
      'value': '0x40d33b601312d9',
      'nonce': '0x65'
    }

    let wallet = new ethers.Wallet(target.privateKey)

    let transaction = {}

    let parsedTransaction = ethers.Wallet.parseTransaction(target.signedTransaction);

    ['nonce', 'gasLimit', 'gasPrice', 'to', 'value', 'data'].forEach(key => {
      let expected = target[key]

      let value = parsedTransaction[key]

      if ({gasLimit: 1, gasPrice: 1, value: 1}[key]) {
        this.equal(!!value._bn, true, `parsed into a big number - ${key}`)
        value = value.toHexString()

        if (!expected || expected === '0x') {
          expected = '0x00'
        }

      } else if (key === 'nonce') {
        this.equal(typeof(value), 'number', `parse into a number - nonce`)

        value = ethers.utils.hexlify(value)

        if (!expected || expected === '0x') {
          expected = '0x00'
        }

      } else if (key === 'data') {
        if (!expected) {
          expected = '0x'
        }

      } else if (key === 'to') {
        if (value) {
          // Make sure teh address is valid
          ethers.utils.getAddress(value)
          value = value.toLowerCase()
        }
      }

      this.equal(value, expected, 'parsed ' + key)

      transaction[key] = target[key]
    })

    this.equal(parsedTransaction.from, ethers.utils.getAddress(target.accountAddress), 'computed from')
    this.equal(parsedTransaction.chainId, 0, 'parsed chainId')


    let signedTransaction = wallet.sign(transaction)
    this.equal(signedTransaction, target.signedTransaction, 'signed transaction')

    // EIP155
    let parsedTransactionChainId5 = ethers.Wallet.parseTransaction(target.signedTransactionChainId5);
    ['data', 'from', 'nonce', 'to'].forEach(key => {
      this.equal(parsedTransaction[key], parsedTransactionChainId5[key], 'eip155 parsed ' + key)
    });
    ['gasLimit', 'gasPrice', 'value'].forEach(key => {
      this.equal(parsedTransaction[key].toString(), parsedTransactionChainId5[key].toString(), 'eip155 parsed ' + key)
    })
    this.equal(parsedTransactionChainId5.chainId, 5, 'eip155 parsed chainId')

    transaction.chainId = 5
    let signedTransactionChainId5 = wallet.sign(transaction)
    this.equal(signedTransactionChainId5, target.signedTransactionChainId5, 'eip155 signed transaction')
  }

  signMessage = function () {
    let Wallet = ethers.Wallet

    let arrayify = ethers.utils.arrayify
    let id = ethers.utils.id
    let toUtf8Bytes = ethers.utils.toUtf8Bytes

    let targets = [
      // See: https://etherscan.io/verifySig/57
      {
        address: '0x14791697260E4c9A71f18484C9f997B308e59325',
        name: 'string("hello world")',
        message: 'hello world',
        messageHash: '0xd9eba16ed0ecae432b71fe008c98cc872bb4cc214d3220a36f365326cf807d68',
        privateKey: '0x0123456789012345678901234567890123456789012345678901234567890123',
        signature: '0xddd0a7290af9526056b4e35a077b9a11b513aa0028ec6c9880948544508f3c63265e99e47ad31bb2cab9646c504576b3abc6939a1710afc08cbf3034d73214b81c'
      },

      // See: https://github.com/ethers-io/ethers.js/issues/80
      {
        address: '0xD351c7c627ad5531Edb9587f4150CaF393c33E87',
        name: 'bytes(0x47173285...4cb01fad)',
        message: arrayify('0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad'),
        messageHash: '0x93100cc9477ba6522a2d7d5e83d0e075b167224ed8aa0c5860cfd47fa9f22797',
        privateKey: '0x51d1d6047622bca92272d36b297799ecc152dc2ef91b229debf84fc41e8c73ee',
        signature: '0x546f0c996fa4cfbf2b68fd413bfb477f05e44e66545d7782d87d52305831cd055fc9943e513297d0f6755ad1590a5476bf7d1761d4f9dc07dfe473824bbdec751b'
      },

      // See: https://github.com/ethers-io/ethers.js/issues/85
      {
        address: '0xe7deA7e64B62d1Ca52f1716f29cd27d4FE28e3e1',
        name: 'zero-prefixed signature',
        message: arrayify(id('0x7f23b5eed5bc7e89f267f339561b2697faab234a2')),
        messageHash: '0x06c9d148d268f9a13d8f94f4ce351b0beff3b9ba69f23abbf171168202b2dd67',
        privateKey: '0x09a11afa58d6014843fd2c5fd4e21e7fadf96ca2d8ce9934af6b8e204314f25c',
        signature: '0x7222038446034a0425b6e3f0cc3594f0d979c656206408f937c37a8180bb1bea047d061e4ded4aeac77fa86eb02d42ba7250964ac3eb9da1337090258ce798491c'
      }
    ]

    targets.forEach(target => {
      let wallet = new Wallet(target.privateKey)
      let signature = wallet.signMessage(target.message)
      this.equal(signature, target.signature, 'computes message signature')
    })

    targets.forEach(target => {
      let address = Wallet.verifyMessage(target.message, target.signature)
      this.equal(address, target.address, 'verifies message signature')
    })

    targets.forEach(target => {
      let hash = Wallet.hashMessage(target.message)
      this.equal(hash, target.messageHash, 'calculates message hash')
    })
  }

  hdnodeDerivation = async function () {
    await wait(100)
    let targets = require('tests/ethers/data/hdnode_random.json')
    let max = targets.length
    for (let i = 0; i < max; i++) {
      this.progress(i, max)
      await wait(0)
      let target = targets[i]
      let rootNode = ethers.HDNode.fromSeed(target.seed)
      target.hdnodes.forEach(nodeTest => {

        let node = rootNode.derivePath(nodeTest.path)
        this.equal(node.privateKey, nodeTest.privateKey, 'Generates privateKey - ' + nodeTest.privateKey)

        let wallet = new ethers.Wallet(node.privateKey)
        this.equal(wallet.address.toLowerCase(), nodeTest.address, 'Generates address - ' + nodeTest.privateKey)
      })
    }
  }

  HDMnemonicPhrases = async function () {
    await wait(100)
    let targets = require('tests/ethers/data/hdnode_random.json')
    let max = targets.length
    for (let i = 0; i < max; i++) {
      this.progress(i, max)
      await wait(0)
      let t = targets[i]
      this.equal(ethers.HDNode.entropyToMnemonic(t.entropy), t.mnemonic, 'Converts entropy to mnemonic ' + t.name)
      this.equal(ethers.HDNode.mnemonicToEntropy(t.mnemonic), t.entropy, 'Converts mnemonic to entropy - ' + t.mnemonic)
      this.equal(ethers.HDNode.mnemonicToSeed(t.mnemonic, t.password), t.seed, 'Converts mnemonic to seed - ' + t.mnemonic + ':' + t.password)
    }
  }

  importMnemonic = function () {
    tryAsync(this.error, async () => {
      // const phrase = `table unhappy romance diary silent sugar exercise squirrel alarm tank like media`
      const phrase = `word solid cart theory purse pupil tip place control electric rifle tag`
      this.info(`mnemonic`, phrase)
      let wallet = await EthWallet.FromMnemonic(phrase)
      this.info(`address`, wallet.address)
    })
  }

  importPrivkey = function () {
    tryAsync(this.error, async () => {
      const privkey = `0xba0790db5adb82e52752b78b40c0fe00cd234e44366e02979082124a41c62c29`
      this.info(`privkey`, privkey)
      let wallet = EthWallet.FromPrivkey(privkey)
      this.info(`address`, wallet.address)
    })
  }

  importKeystore = function () {
    tryAsync(this.error, async () => {
      const keystore = `{"address":"59548264d6335dae60bae332633636d990e49804","crypto":{"cipher":"aes-128-ctr","ciphertext":"c0ab8e972f962a26fb968124991cae22d714d9abbc7d8cd902daa4164a4df438","cipherparams":{"iv":"6729e78277a7fd7e7303e0623a678776"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"93b3039bc872cb5f0bf7db57ddd506e04ec9ed3a5241a14e81c2b732a959c393"},"mac":"4e108e75209b5c0539081714d19928f244f69072851db8788c3bb3cbd2541e20"},"id":"27b59c39-e004-4190-9ffd-43f6df0e4a93","version":3}`
      this.info(`keystore`, keystore)
      let wallet = await EthWallet.FromKeystore(keystore, `123456789`)
      this.info(`address`, wallet.address)
    })
  }

  exportKeystore = function () {
    tryAsync(this.error, async () => {
      let wallet = await EthWallet.Random()
      this.info(`privkey`, wallet.privkey)
      this.info(`address`, wallet.address)
      let ks = await wallet.exportKeystore(`123456`)
      this.info(`keystore`, ks)
    })
  }

  sendEth = function () {
    tryAsync(this.error, async () => {
      await wait(100)
      let pharse = 'table unhappy romance diary silent sugar exercise squirrel alarm tank like media'
      let wallet = ethers.Wallet.fromMnemonic(pharse)
      let from = wallet.getAddress()
      let provider = new ethers.providers.FallbackProvider([
        new ethers.providers.JsonRpcProvider(`http://172.29.1.169:8845`, 'testnet'),
        // new ethers.providers.EtherscanProvider(this.credentials.network === 'testnet'),
      ])
      wallet.provider = provider
      const result = await provider.getBalance(from)
      this.info(`balance:`, `${ethers.utils.fromWei(result)} ETH`)

      const tx = {
        from,
        to: '0x952a50EA1C0BC0127738bFE8099eC76969543D4a',
        value: ethers.utils.toWei('0.01'),
        gasLimit: 21000,
        // gasPrice: web3Utils.toWei(5, "Gwei"),
        data: '0x',
      }
      this.info(`origin tx`, JSON.stringify(tx, null, 2))
      const txhash = await wallet.sendTransaction(tx)
      this.info(`tx hash`, txhash.hash)
    })
  }

  sendErc20 = function () {
    tryAsync(this.error, async () => {
      await wait(100)
      let pharse = 'table unhappy romance diary silent sugar exercise squirrel alarm tank like media'
      let wallet = ethers.Wallet.fromMnemonic(pharse)
      let from = wallet.getAddress()
      let provider = new ethers.providers.FallbackProvider([
        new ethers.providers.JsonRpcProvider(`http://172.29.1.169:8845`, 'testnet'),
        // new ethers.providers.EtherscanProvider(this.credentials.network === 'testnet'),
      ])
      wallet.provider = provider
      const result = await provider.getBalance(from)
      this.info(`balance:`, `${ethers.utils.fromWei(result)} ETH`)

      const tx = {
        from,
        to: '0x952a50EA1C0BC0127738bFE8099eC76969543D4a',
        value: ethers.utils.toWei('0.01'),
        gasLimit: 21000,
        // gasPrice: web3Utils.toWei(5, "Gwei"),
        data: '0x',
      }
      this.info(`origin tx`, JSON.stringify(tx, null, 2))
      const txhash = await wallet.sendTransaction(tx)
      this.info(`tx hash`, txhash.hash)
    })
  }

  walletLibrary = function () {
    tryAsync(this.error, async () => {
      await wait(100)
      let pharse = 'table unhappy romance diary silent sugar exercise squirrel alarm tank like media'
      const wallet = EthWallet.FromMnemonic(pharse)
      wallet.setProvider('http://172.29.1.169:8845')
      const balance = await wallet.getBalance(`0xB1bcEC4EB1f476673fef3d341E7eF2aAf596Ed4F`)
      this.info(`${wallet.address} balance:`, balance)

      // const tx = await wallet.send(`0x7768F5969C19CA5AaD8846343532B3348C5F11Da`, `0.01`)
      const tx = await wallet.send(`0x7768F5969C19CA5AaD8846343532B3348C5F11Da`, `0.01`, `0xB1bcEC4EB1f476673fef3d341E7eF2aAf596Ed4F`)
      console.log(tx)
    })
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back"/>
            </Button>
          </Left>
          <Body>
          <Title>Ethers</Title>
          </Body>
          <Right/>
        </Header>

        <Content style={{padding: 5}}>
          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Renderlog', {run: this.privkeyGeneration})
                  }}>
            <Text>Private key generation</Text>
          </Button>

          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Renderlog', {run: this.decryptKeystore})
                  }}>
            <Text>Decrypt Keystore</Text>
          </Button>

          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Renderlog', {run: this.transactionParse})
                  }}>
            <Text>解析交易</Text>
          </Button>

          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Renderlog', {run: this.signMessage})
                  }}>
            <Text>Sign Message</Text>
          </Button>

          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Renderlog', {run: this.hdnodeDerivation})
                  }}>
            <Text>HDnode Derivation</Text>
          </Button>

          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Renderlog', {run: this.HDMnemonicPhrases})
                  }}>
            <Text>HD Mnemonic Phrases</Text>
          </Button>

          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Renderlog', {run: this.importMnemonic})
                  }}>
            <Text>导入助记词</Text>
          </Button>

          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Renderlog', {run: this.importPrivkey})
                  }}>
            <Text>导入私钥</Text>
          </Button>

          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Renderlog', {run: this.importKeystore})
                  }}>
            <Text>导入Keystore</Text>
          </Button>

          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Renderlog', {run: this.exportKeystore})
                  }}>
            <Text>导出Keystore</Text>
          </Button>

          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Renderlog', {run: this.sendEth})
                  }}>
            <Text>Eth 交易</Text>
          </Button>

          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Renderlog', {run: this.sendErc20})
                  }}>
            <Text>Erc20 交易</Text>
          </Button>

          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Renderlog', {run: this.walletLibrary})
                  }}>
            <Text>Wallet Library</Text>
          </Button>
        </Content>
      </Container>
    )
  }
}


const s = StyleSheet.create({
  button: {
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#00B8C4',
    marginBottom: 10,
  }
})
