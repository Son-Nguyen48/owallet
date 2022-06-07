import { MessageRequester, Message, JSONUint8Array } from '@owallet/router';
import { ExtensionEnv } from '../env';

export class InExtensionMessageRequester implements MessageRequester {
  async sendMessage<M extends Message<unknown>>(
    port: string,
    msg: M
  ): Promise<M extends Message<infer R> ? R : never> {
    msg.validateBasic();

    // Set message's origin.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    msg['origin'] =
      typeof window !== 'undefined'
        ? window.location.origin
        : new URL(browser.runtime.getURL('/')).origin;

    const routerId = await ExtensionEnv.assignCmd('get-router-id');
    msg.routerMeta = {
      ...msg.routerMeta,
      routerId
    };

    const result = JSONUint8Array.unwrap(
      await browser.runtime.sendMessage({
        port,
        type: msg.type(),
        msg: JSONUint8Array.wrap(msg)
      })
    );

    if (!result) {
      throw new Error('Null result');
    }

    if (result.error) {
      throw new Error(result.error);
    }

    return result.return;
  }

  static async sendMessageToTab<M extends Message<unknown>>(
    tabId: number,
    port: string,
    msg: M
  ): Promise<M extends Message<infer R> ? R : never> {
    msg.validateBasic();

    // Set message's origin.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    msg['origin'] =
      typeof window !== 'undefined'
        ? window.location.origin
        : new URL(browser.runtime.getURL('/')).origin;
    const routerId = await ExtensionEnv.assignCmd('get-router-id');
    msg.routerMeta = {
      ...msg.routerMeta,
      routerId
    };

    const result = JSONUint8Array.unwrap(
      await browser.tabs.sendMessage(tabId, {
        port,
        type: msg.type(),
        msg: JSONUint8Array.wrap(msg)
      })
    );

    if (!result) {
      throw new Error('Null result');
    }

    if (result.error) {
      throw new Error(result.error);
    }

    return result.return;
  }
}
