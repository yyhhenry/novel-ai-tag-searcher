import type { BridgeDef } from './declaration';
import type { OpenDialogOptions, app } from 'electron';
export interface DialogBaseModule extends BridgeDef.BridgeBaseModule {
    getPath: typeof app.getPath;
    openFile: (option: OpenDialogOptions) => string[];
}
export interface WholeBase extends BridgeDef.BridgeWholeBase {
    dialog: DialogBaseModule;
}
export type WholeHandler = BridgeDef.BridgeWholeHandler<WholeBase>;
export type WholeRemote = BridgeDef.BridgeWholeRemote<WholeBase>;
