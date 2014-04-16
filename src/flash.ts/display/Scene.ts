/**
 * Copyright 2013 Mozilla Foundation
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Class: Scene
module Shumway.AVM2.AS.flash.display {
  import notImplemented = Shumway.Debug.notImplemented;
  export class Scene extends ASNative {
    
    // Called whenever the class is initialized.
    static classInitializer: any = null;
    
    // Called whenever an instance of the class is initialized.
    static initializer: any = null;
    
    // List of static symbols to link.
    static staticBindings: string [] = null; // [];
    
    // List of instance symbols to link.
    static bindings: string [] = null; // ["_name", "_labels", "_numFrames", "name", "labels", "numFrames"];
    
    constructor (name: string, labels: any [], numFrames: number /*int*/) {
      false && super();
      this._name = "" + name;
      this._labels = labels;
      this._numFrames = numFrames | 0;
    }
    
    // JS -> AS Bindings
    
    _name: string;
    _labels: any [];
    _numFrames: number /*int*/;
    
    // AS -> JS Bindings


    get name(): string {
      return this._name;
    }

    get labels(): any [] {
      return this._labels;
    }

    get numFrames(): number {
      return this._numFrames;
    }
  }
}