import { getEncodedFuelPathFromTrade, getFuelPathParamsFromTrade } from './trade'
import { SerializedTrade } from '@1delta/type-sdk'

/** Convert raw path data to usable fuel calldata */
export class FuelPathConverter {

  /** Use InterfaceTrade object to encode paths for injecting it as `scriptData` */
  public static encodeFuelPaths(
    trade: SerializedTrade,
    receiver: string,
    slippageToleranceBps: string,
    deadline: number,
  ) {
    return getEncodedFuelPathFromTrade(trade, receiver, slippageToleranceBps, deadline)
  }

  /** Use InterfaceTrade object to get parameters for `main` */
  public static getFuelPathParameters(trade: SerializedTrade, receiver: string, slippageToleranceBps: string) {
    return getFuelPathParamsFromTrade(trade, receiver, slippageToleranceBps)
  }
}
