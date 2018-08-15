import Bip39 from 'react-native-bip39'
import Ethers from 'ethers'
import EtherTokenERC20 from './EtherTokenERC20'

/**
 * Usage:
 * 1. create random wallet:
 * ```js
 *   let wallet = EthWallet.Random()
 * 2. 导入/导出钱包
 * ```
 * 2.1. import from mnemonic phrase:
 * ```js
 *   let wallet = EthWallet.FromMnemonic(`${phrase}`)
 * ```
 * 2.2. import from privatekey:
 * ```js
 *   let wallet = EthWallet.FromPrivkey(`${privkey}`)
 * ```
 * 2.3. import from keystore:
 * ```js
 *   let wallet = EthWallet.FromKeystore(`${keystore}`, `${password}`)
 * ```
 * 2.4. export keystore:
 * ```js
 *   let ks = await EtherWallet.ExportKeystore(`${password}`)
 * ```
 * 3. get address:
 * ```js
 *   let address = wallet.address()
 * ```
 * 4. set provider:
 * ```js
 *   wallet.setProvider(`http://127.0.0.1:8545`)
 * ```
 * 5. 查询余额
 * 5-1. get eth balance:
 * ```js
 *   let balance = await wallet.getBalance()
 * ```
 * 5-6. get erc20 balance:
 * ```js
 *   let balance = await wallet.getBalance(`0xB1bcEC4EB1f476673fef3d341E7eF2aAf596Ed4F`)
 * ```
 * 6. 转账
 * 6-1. send eth:
 * ```js
 *   let txhash = await wallet.send(to, value, null, {gasPrice:toWei(`100Gwei`), gasLimit:21000})
 * ```
 * 6-2. send erc20:
 * ```js
 *   let txhash = await wallet.send(to, value, `0xB1bcEC4EB1f476673fef3d341E7eF2aAf596Ed4F`, {gasPrice:toWei(`100Gwei`), gasLimit:21000})
 * ```
 */
export default class EthWallet {
  provider: null
  _instance: null //@TODO should be private
  _address: null

  static async Random() {
    const phrase = await Bip39.generateMnemonic()
    console.log(`Bip39.validateMnemonic(${phrase})`, Bip39.validateMnemonic(phrase))
    const instance = new EthWallet()
    console.log(phrase)
    instance._instance = Ethers.Wallet.fromMnemonic(phrase)
    return instance
  }

  static FromMnemonic(phrase) {
    const instance = new EthWallet()
    instance._instance = Ethers.Wallet.fromMnemonic(phrase)
    return instance
  }

  static FromPrivkey(privkey) {
    const instance = new EthWallet()
    instance._instance = new Ethers.Wallet(privkey)
    return instance
  }

  static async FromKeystore(keystore, password) {
    const instance = new EthWallet()
    instance._instance = await Ethers.Wallet.fromEncryptedWallet(keystore, password)
    return instance
  }

  get address() {
    if (!this._address) {
      this._address = this._instance.getAddress()
    }
    return this._address
  }

  get privkey() {
    return this._instance.privateKey
  }

  get etherWallet() {
    return this._instance
  }

  setProvider(url, network = 'testnet') {
    let provider = new Ethers.providers.FallbackProvider([
      new Ethers.providers.JsonRpcProvider(url, network),
      // new ethers.providers.EtherscanProvider(this.credentials.network === 'testnet'),
    ])
    this._instance.provider = provider
    this.provider = provider
  }

  async exportKeystore(password) {
    return this._instance.encrypt(password)
  }

  async getBalance(contract = null) {
    this.mustHaveProvider()
    if (contract) {
      return this.proxySubToken(this.getBalance.name, this.address, contract)
    }
    let balance = await this.provider.getBalance(this.address)
    return Ethers.utils.fromWei(balance)
  }

  /**
   * @param {string} to 收款地址
   * @param {string} value 发送数量, 单位ETH的字符串,如 `1.03` → 1.03ETH
   * @param {string=null} contract 合约地址, 非空时表示该交易为合约交易
   * @param {Object} opts
   * @param {string=null} opts.data 自定义数据
   * @param {string=null} opts.gasPrice 自定义gasPrice, 单位GWei
   * @param {number=null} opts.gasLimit 自定义gasLimit, 数字类型
   * @param {number=null} opts.nonce 自定义nonce, 数字类型
   */
  async send(to, value, contract = null, opts) {
    this.mustHaveProvider()

    if (contract) {
      return this.proxySubToken(this.send.name, to, value, contract, opts || undefined)
    }
    let tx = await this._sendEth(to, value, opts || undefined)
    if (!tx || !tx.hash)
      throw new Error(`send ETH fail`)
    return tx.hash
  }

  async _sendEth(to, value, opts = {}) {
    let {gasPrice = `100`, gasLimit = 21000, nonce = 0, data = '0x'} = opts
    if (gasPrice) gasPrice = Ethers.utils.toWei(gasPrice, 'gwei')
    const tx = {
      from: this.address,
      to,
      value: Ethers.utils.toWei(value),
      gasLimit,
      gasPrice,
      data,
      nonce,
    }

    return this._instance.sendTransaction(tx)
  }

  mustHaveProvider() {
    if (!this.provider)
      throw new Error(`missing provider`)
  }

  async proxySubToken(funcName, ...args) {
    console.log(funcName, args)
    let subtokenInstance = new EtherTokenERC20(this)

    return await subtokenInstance[funcName](...args)
  };
}
