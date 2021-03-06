/*
 * Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package flash.net {
import flash.events.EventDispatcher;

[native(cls="URLLoaderClass")]
public class URLLoader extends EventDispatcher {
  public native function URLLoader(request:URLRequest = null);
  public var data;
  public var dataFormat:String;
  public var bytesLoaded:uint;
  public var bytesTotal:uint;
  public override native function addEventListener(type:String, listener:Function,
                                                   useCapture:Boolean = false, priority:int = 0,
                                                   useWeakReference:Boolean = false):void;
  public native function load(request:URLRequest):void;
  public native function close():void;
}
}
