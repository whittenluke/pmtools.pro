Auto scroll
An optional package that enables automatic scrolling during a drag operation
About
Unsafe overflow scrolling
Code
Changelog
This package works with any configuration of scrollable entities, and you can change the configuration of your scrollable entities in any way you like during a drag.

This package depends on the core package.

This package has no dependency on any view library (eg react), or on the Atlassian Design System.

Registering auto scrolling for scrollable elements
Elements that are registered for auto scrolling will be scrolled as a user drags close to the edges of the element.

// each adapter type has its own auto scroller
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { autoScrollForExternal } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/external';
import { autoScrollForTextSelection } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/text-selection';

// enable better auto scrolling
const cleanup = autoScrollForElements({
element: myScrollableElement,
});

// disable better auto scrolling
cleanup();
A slightly fuller example of a react list that is a drop target, and has auto scrolling

import { useRef, ReactElement } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import invariant from 'tiny-invariant';

function ScrollableList({ children }: { children: ReactElement }) {
const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const element = ref.current;
        invariant(element, 'Element ref not set');

        return combine(
            dropTargetForElements({
                element,
            }),
            // A scrollable element does not need to be a drop target,
            // but in this case it is.
            // We can add auto scrolling to an element along side our other
            // Pragmatic drag and drop bindings
            autoScrollForElements({
                element,
            }),
        );
    });

    return (
        <div ref={ref} style={{ overflowY: 'scroll' }}>
            {children}
        </div>
    );

}
Element scrolling rules and behaviour
You can position and style your scrollable elements however you like.
Your scroll containers can have as many levels of nesting as you like.
You have to register an element (eg with autoScrollForElements) to enable auto scrolling (otherwise the default auto scrolling will apply).
A registered scrollable element does not need to be drop target.
Auto scrolling is registered for particular entity types. For example, autoScrollForElements is a drop target for elements, and autoScrollForExternal is for native drags.
During a drag operation, you can:
Register new scrollable elements
Unregister scrollable elements
Change the styling, layout or dimensions of any scrollable element
autoScrollFor\* arguments
element: the HTMLElement you want to add auto scrolling too. The element does not need to be a drop target. The element is the unique key for an auto scrolling registration.
(optional): canScroll: (args: ElementGetFeedbackArgs) => boolean: whether or not auto scrolling should occur. Disabling auto scrolling with canScroll will not prevent the browsers built in auto scrolling, or manual user scrolling during a drag. Unfortunately, there is no way to opt out of the platforms built in auto scrolling. We included canScroll because it is helpful to disable this package's auto scrolling, as it is much easier for users to trigger than the platforms built in auto scrolling.
canScroll is a helpful way to only enable auto scrolling for particular entity types.

autoScrollForElements({
element: myElement,
// only enable auto scrolling when a Card is being dragged
canScroll: ({ source }) => source.data.type === 'card',
}),
export type ElementGetFeedbackArgs = {
/**
_ The users *current* input
_/
input: Input;
/**
_ The data associated with the entity being dragged
_/
source: DragType['payload'];
/\*\*
_ The element trying to be scrolled
_/
element: Element;
};
(optional): getAllowedAxis: (args: ElementGetFeedbackArgs) => AllowedAxis: used to enable auto scrolling only on a particular axis. See Axis locking guide.

(optional): getConfiguration: (args: ElementGetFeedbackArgs) => PublicConfig: used to control some aspects of auto scrolling

autoScrollForElements({
element: myElement,
getConfiguration: () => ({
maxScrollSpeed: 'fast',
})
}),
We are intentionally only exposing a limited amount of configuration in order to promote consistency. Right now we only expose a single simple configuration option:

maxScrollSpeed: 'fast' | 'standard'. We recommend using the default "standard" max scroll speed for most experiences. However, on some larger experiences, a faster max scroll speed "fast" can feel better.
Registering auto scrolling for the window
import { autoScrollWindowForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { autoScrollWindowForExternal } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/external';
import { autoScrollWindowForInternalUncontrolled } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/internal-uncontrolled';

// enable better auto scrolling on the window during drag operations
const cleanup = autoScrollWindowForElements();

// disable better auto scrolling on the window
cleanup();
A slightly fuller example of a react board that has window auto scrolling

import { useRef, ReactElement } from 'react';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import invariant from 'tiny-invariant';

function Board({ children }: { children: ReactElement }) {
useEffect(() => {
return autoScrollWindowForElements();
});

    return <div className="board">{children}</div>;

}
Window auto scrolling rules and behaviour
You have to register window auto scrolling (eg with autoScrollWindowForElements) to enable auto scrolling (otherwise the default auto scrolling will apply).
Auto scrolling is registered for particular entity types. For example, autoScrollWindowForElements will do auto scrolling when an element is being dragged, and autoScrollWindowForExternal will do auto scrolling when something from outside the window is being dragged over the window
You can have multiple registrations for window auto scrolling, but only one registration will be needed for window auto scrolling to occur.
If there are no active registrations for window auto scrolling, then no window auto scrolling will occur (except for the built in one).
During a drag operation:
You can register or unregister window auto scrolling
You can change the content of the document so that the window grows or shrinks
autoScrollWindowFor\* arguments
(optional): canScroll: (args: WindowGetFeedbackArgs) => boolean: whether or not auto scrolling should occur. Disabling auto scrolling with canScroll will not prevent the browsers built in auto scrolling, or manual user scrolling during a drag. Unfortunately, there is no way to opt out of the platforms built in auto scrolling. We included canScroll because it is helpful to disable this packages auto scrolling, as it is much easier for users to trigger than the platforms built in auto scrolling.
canScroll is a helpful way to only enable auto scrolling for particular entity types.

autoScrollWindowForElements({
// only enable auto scrolling when a Card is being dragged
canScroll: ({ source }) => source.data.type === 'card',
}),
export type ElementGetFeedbackArgs = {
/**
_ The users *current* input
_/
input: Input;
/**
_ The data associated with the entity being dragged
_/
source: DragType['payload'];
};
Scroll speed dampening
We slow down the scroll speed based on two factors: time over an element, and closeness to an edge.

Time dampening
The longer a user drags over a scrollable entity, the faster the scroll speed will be (up to a limit).

Time dampening helps a user to avoid loosing context by scrolling too quickly when:

Lifting a draggable element inside of a scrollable element
Dragging into a scrollable element
Time dampening is reset when you leave an element, so if you re-renter an element again, time dampening starts again.

Our time dampening value has been tuned to balance:

Trying to avoid losing context
Letting the user get stuff done quickly
Time dampening is shared between "over element" and "overflow" auto scroll regions.

Time dampening is reset when:

A scrollable entity is unregistered for more than one frame
A scrollable entity is no longer being dragged over (except for the window - see below)
A drag operation is finished
The window time dampening timer does not reset if leaving the window. Currently no onDragLeaveWindow and onDragEnterWindow events are published by Pragmatic drag and drop. If we did publish those events, then we could reset the auto scrolling acceleration timer for the window when entering the window.

Distance dampening
The closer a user's pointer is to the edge of a scrollable entity (element or window), the faster the scroll will be. Distance dampening allows a user to control the scroll speed by moving closer / further away from a scrollable edge

The max speed can be reached a distance away from the actual edge of a scrollable element. This is so that users don't have to move right onto the edge to get the max speed - they can get the max speed from a small distance out from the edge

Distance dampening
Dynamic scroll speed
In order to facilitate a great experience for all users, on all devices, we dynamically adjust the speed of scroll changes based on the devices frame rate (measured in frames per second - fps)

Devices running at 60fps

We can scroll up to our maximum target scroll change in a frame

Devices running at higher frame rates (eg 120fps displays)

We lower the max scroll change per frame to ensure we don’t scroll too fast.

If we made the same scroll change per frame on a 120fps device as we did on a 60fps device, then the 120fps device would be scrolling twice as fast

The auto scroller ensures that a 120fps display scrolls at the same visible speed as a 60fps devices.

Devices running at slower than 60fps

You might think we would do the inverse of what we do for the 120fps devices - increase the max change per frame so that the overall speed would match a 60fps device. However, this can lead to large scroll changes in a single frame causing the experience to feel janky.

For lower frame rate devices, we cap the max scroll change per frame to match would it would be if the device was running at 60fps. This can result in a slower over all scroll speed, but the scroll will always feel smooth.

Dynamic switching

These rules are applied on a per frame basis. One device might move between all three categories in the same drag operation.

Scroll bubbling
In order to match the browser as closely as possible, as well as to provide an experience that feels great, we have landed on the following algorithm for scrolling:

Only scroll scrollable entities that the user is currently dragging over with their pointer.
We scroll the inner most scrollable entity first, and then work upwards. This is known as bubble ordering and it is the same order that Pragmatic drag and drop events flow.
Only scroll one scrollable entity per axis (vertical / horizontal) in a frame. In order for a scrollable entity to be scrolled on an axis, it needs to have some available scroll in the applicable direction (forwards / backwards).
Bubbling examples
For these examples, we have two elements that are both scrollable: child and parent

<div id="parent">
    <div id="child">
        <!-- content -->
    </div>
</div>
Scenario: Based on hitboxes, both child and parent could be scrolled forwards vertically and horizontally child and parent both have available scroll vertically and horizontally.

child is scrolled forwards vertically and horizontally
parent is not scrolled
Scenario: Based on hitboxes, both child and parent could be scrolled forwards vertically and horizontally child has no available scroll vertically, but has scroll available horizontally parent has available scroll vertically and horizontally

child is scrolled horizontally (child has no available scroll vertically)
parent is scrolled vertically (child has already been scrolled horizontally so parent can only be scrolled vertically)
Deferred loading
This package supports being loaded in asyncronously, and can be loaded even after a drag has started.

const { autoScrollForElements } = await import(
'@atlaskit/pragmatic-drag-and-drop-auto-scroll/element'
);
In this example, we start loading the auto scroller code after the drag has started, but you could load in the auto scroller whenever you like.

Auto scrolling:
pending

See our deferred loading guide for more information.

Axis Locking
This package provides support for axis locking, which allows you to disable auto scrolling on a specific axis. However, there are some important considerations to keep in mind.

autoScrollForElements({
element: myElement,
getAllowedAxis: () => 'vertical',
}),
Browsers have built in auto scrolling during a drag operation, which does not provide a great experience and it cannot be disabled. This package has been designed to complement built in auto scrolling. Additionally, a user can manually scroll any scroll container during a drag.

Due to the inability to disable the browser's built-in auto scroller, full axis locking functionality cannot be provided by this package alone. To achieve complete axis locking, you must modify the scroll container to restrict scrolling to a single direction. This is typically accomplished by setting overflowX or overflowY to hidden on the scroll container.

Please note that even with the allowedAxis prop set to a specific axis, the browser's built-in auto scroller will continue to scroll on all scrollable axes. The allowedAxis prop only restricts the axis from the perspective of this package, not the browser's perspective.

One important aspect to note is that time dampening is not cancelled when changing the allowed axis mid-drag. This is different from the canScroll function, where changing it's return value does reset time dampening. This means that if you switch the allowed axis during a drag, the auto scroller will continue at its current speed on the newly allowed axis. We decided not to reset time dampening on allowed axis changes for now as it would introduce a decent amount of internal complexity.

Declarative vs automatic scrollable entity registration
This package works by declaratively registering scrollable entities. An alternative would be to automatically apply auto scrolling to everything that is scrollable during a drag.

We chose declarative registrations for a few reasons:

They allow for per item configuration (for example, adjusting the speed and auto scroll hitboxes for specific entities).
They allow us to easily enable / disable scrolling during a drag (through canScroll())
They align with the existing declarative Pragmatic drag and drop API
Registrations are a cheap way of identifying what is scrollable, otherwise we have to check all elements (through window.getComputedStyles(element)) to check what is scrollable, which has poor performance characteristics.

Unsafe overflow scrolling allows the user to scroll a scrollable element when they are no longer over the element.

Challenges with overflow scrolling
Avoid overflow scrolling
These challenges are why overflow scrolling is considered unsafe. It should only be used when there is a strong product justification.

It can be confusing for users
Overflow scrolling can feel great, but it does not play well with the web platform's drag and drop capabilities. In order to update the drop target for a drag operation, the user needs to drag over an element. With overflow scrolling, the interface can be changing, but the drop target might not be as the user might not be over the drop target. This can be confusing for users

It is easy to create strange experiences
When you enable overflow scrolling, it is easy to have multiple scrollable elements scrolling at the same time in unexpected ways. This is because we can no longer rely on the DOM hierarchy to help us provide an scrolling experience that will always feel great. This package gives you the control to setup auto scrolling how you want it, but you will need to be careful to ensure that the settings you have chosen work well for the experience you are making.

It is more expensive than standard overflow scrolling
When doing standard 'over element' auto scrolling, we can leverage the DOM hierarchy to quickly search for relevant scroll containers. We cannot do that for overflow scrolling. For every overflow scrolling registration (eg unsafeOverflowForElements()), we need to do a element.getBoundingClientRect() in each animation frame to see if we are over the element (we have to re-create hitbox testing). Doing excessive amounts of of getBoundingClientRect() can get expensive, so we suggest you don't add too many overflow scrolling registrations.

Registering unsafe overflow scrolling for scrollable elements
Registering unsafe overflow scrolling will only enable scrolling when outside of the element. If you want the element to be scrollable when over the element, then you will also need to add 'over element' auto scrolling as well (eg autoScrollForElements()).

// each adapter type has its own overflow auto scroller
import { unsafeOverflowForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element';
import { unsafeOverflowForExternal } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/external';
import { unsafeOverflowForTextSelection } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/text-selection';

import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';

const cleanup = combine(
// Enabling scrolling when over an element
autoScrollForElements({
element,
}),
// Enabling scrolling when outside an element - in the overflow
unsafeOverflowForElements({
element,
}),
);

// disable auto scrolling
cleanup();
A slightly fuller example of a react list that is a drop target, and has auto scrolling:

import { useRef, ReactElement } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { unsafeOverflowForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import invariant from 'tiny-invariant';

function ScrollableList({ children }: { children: ReactElement }) {
const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const element = ref.current;
        invariant(element, 'Element ref not set');

        return combine(
            dropTargetForElements({
                element,
            }),
            // Enabling scrolling when "over" an element
            autoScrollForElements({
                element,
            }),
            // Enabling overflow auto scrolling
            unsafeOverflowForElements({
                element,
            }),
        );
    });

    return (
        <div ref={ref} style={{ overflowY: 'scroll' }}>
            {children}
        </div>
    );

}
Element scrolling rules and behaviour
Overflow scrolling has the same flexible rules as 'over element' auto scrolling - you can have any setup you want, and change anything you want during a drag.

unsafeOverflowAutoScrollFor\* arguments
element: the HTMLElement you want to add auto scrolling too. The element does not need to be a dropTarget. The element is the unique key for an auto scrolling registration.
getOverflow: () => ProvidedHitboxSpacing. ProvidedHitboxSpacing allows you to specify how overflow scrolling should occur for a element.
getOverflow() allows you to specify how overflow scrolling should work for each edge of an element.

API visual explanation

// Only allow overflow scrolling above and below an element by 400px
unsafeOverflowAutoScrollForElements({
element,
getOverflow: () => ({
forTopEdge: {
top: 400,
},
forBottomEdge: {
bottom: 400,
},
}),
});

unsafeOverflowAutoScrollForElements({
element,
getOverflow: () => ({
forTopEdge: {
// Allow the top element to be overflow scrolled up to
// 2000px away from the element
top: 2000,
// Allow the top element to be overflow scrolled when
// up to 200px on the left or right of the top edge.
// The hitbox for scrolling will extend down below the top edge
// to match the "over element" hitbox for the top edge.
// See the diagram for more details.
left: 200,
right: 200,

            // The "bottom" edge definition for the "top" edge is
            // handled by the "over element" auto scroller.
        },
    }),

});
(optional): canScroll: (args: ElementGetFeedbackArgs) => boolean: whether or not auto scrolling should occur. Disabling auto scrolling with canScroll will not prevent the browser's built in auto scrolling, or manual user scrolling during a drag. Unfortunately, there is no way to opt out of the platform's built in auto scrolling. We included canScroll because it is helpful to disable this package's auto scrolling, as it is much easier for users to trigger than the platform's built in auto scrolling.
Scroll acceleration
Builds on 'over element' auto scrolling.
When outside of the element on the main axis of an edge (eg vertical axis for the top edge), then the max scroll speed is applied.
Time dampening timer is shared with 'over element' auto scrolling. This means that time dampening will carry over correctly when moving between 'over element' and 'overflow scrolling'.
Distance dampening is applied when in the "cross axis" component of an edges hitbox (see the checkered area of the diagram below). This is so that the scroll speed inside an edge is the same when inside the element, or when outside the element.
Diagram of overflow scrolling logic

Window scrolling
Overflow scrolling is not applicable for window scrolling as the browser stops publishing events to the document once the user has left the window. If you want to have window scrolling, then use our standard approach for registering auto scrolling for the window.

Auto scroll
An optional Pragmatic drag and drop package that enables automatic scrolling during a drag operation
About
Unsafe overflow scrolling
Code
Changelog
Installation
Package installation information
Install yarn add @atlaskit/pragmatic-drag-and-drop-auto-scroll
Source Bitbucket.org﻿, (opens new window)
npm @atlaskit/pragmatic-drag-and-drop-auto-scroll﻿, (opens new window)
Bundle unpkg.com﻿, (opens new window)
Was this page helpful?

Auto scroll
An optional package that enables automatic scrolling during a drag operation
About
Unsafe overflow scrolling
Code
Changelog
2.1.0
Minor Changes
#1723744ca6346256c8a - Minor increase of time dampening duration. After lots of explorations, we have increased the value to make it easier for people to avoid the impacts of rapid scroll speed spikes when lifting or entering into a high scroll speed area.
2.0.0
Major Changes
#170839 1534389dcb75b - In order to improve clarity, we have renamed the from*Edge (eg fromTopEdge) argument properties to for*Edge (eg forTopEdge) for the overflow scroller. If you are not using overflow scrolling, there is nothing you need to do.

- fromTopEdge

* forTopEdge

- fromRightEdge

* forRightEdge

- fromBottomEdge

* forBottomEdge

- fromLeftEdge

* forLeftEdge
  const unbind = unsafeOverflowAutoScrollForElements({
  element,
  getOverflow: () => ({

-           fromTopEdge: {

*           forTopEdge: {
                top: 6000,
                right: 6000,
                left: 6000,
            },

-           fromRightEdge: {

*           forRightEdge: {
                top: 6000,
                right: 6000,
                bottom: 6000,
            },

-           fromBottomEdge: {

*           forBottomEdge: {
                right: 6000,
                bottom: 6000,
                left: 6000,
            },

-           fromLeftEdge: {

*           forLeftEdge: {
                  top: 6000,
                  left: 6000,
                  bottom: 6000,
              },
          }),
  });
  We thought that for\* more accurately represented what was being provided, as these are the overflow definitions for a defined edge.

We have also improved the types for for\*Edge so that you do not need to provide redundant cross axis information if you only want to overflow scroll on the main axis.

const unbind = unsafeOverflowAutoScrollForElements({
element,
getOverflow: () => ({
forTopEdge: {
top: 100,

-       // no longer need to pass `0` for the cross axis if you don't need it

*               right: 0,
*               left: 0,
            },
            forRightEdge: {
                right: 100,
*               top: 0,
*               bottom: 0,
            },
            forBottomEdge: {
                bottom: 100,
*               right: 0,
*               left: 0,
            },
            forLeftEdge: {
                left: 100,
*               top: 0,
*               bottom: 0,
              },
          }),
  });
  When declaring overflow scrolling for an edge, you cannot provide how deep the scrolling should occur into the element (that is defined by the "over element" overflow scroller). Providing redundant information for an edge will now also give a type error rather than providing no feedback.

const unbind = unsafeOverflowAutoScrollForElements({
element,
getOverflow: () => ({
forTopEdge: {
top: 100,
bottom: 30, // ❌ now a type error
},
forRightEdge: {
right: 100,
left: 10, // ❌ now a type error
},
forBottomEdge: {
bottom: 100,
top: 200, // ❌ now a type error
},
forLeftEdge: {
left: 100,
right: 20, // ❌ now a type error
},
}),
});
1.4.0
Minor Changes
#116572 98c65e7ff719c - 🍯 Introducing "the honey pot fix" which is an improved workaround for a painful browser bug.

Background

The browser bug causes the browser to think the users pointer is continually depressed at the point that the user started a drag. This could lead to incorrect events being triggered, and incorrect styles being applied to elements that the user is not currently over during a drag.

Outcomes

Elements will no longer receive MouseEvents (eg "mouseenter" and "mouseleave") during a drag (which is a violation of the drag and drop specification)
Elements will no longer apply :hover or :active styles during a drag. Previously consumers would need to disable these style rules during a drag to prevent these styles being applied.
Dramatically improved post drop performance. Our prior solution could require a noticeable delay due to a large style recalculation after a drop.
Patch Changes
Updated dependencies
1.3.0
Minor Changes
#95426 a58266bf88e6 - Adding axis locking functionality

- // `getAllowedAxis` added to element, text selection and external auto scrollers

  autoScrollForElements({
  element: myElement,

- getAllowedAxis: (args: ElementGetFeedbackArgs<DragType>) => 'horizontal' | 'vertical' | 'all',
  });

autoScrollWindowForElements({

- getAllowedAxis: (args: WindowGetFeedbackArgs<DragType>) => 'horizontal' | 'vertical' | 'all',
  });

unsafeOverflowAutoScrollForElements({

- getAllowedAxis?: (args: ElementGetFeedbackArgs<DragType>) => AllowedAxis;
  })
  1.2.0
  Minor Changes
  1.2.0 is deprecated on npm and should not be used. Shortly after release we decided to change this API
  #94103 4e3fb63eb288 - Added axis locking functionality.

autoScrollForElements({
element: myElement,
getConfiguration: () => ({
maxScrollSpeed: 'fast' | 'standard',

- allowedAxis: 'horizontal' | 'vertical' | 'all',
  }),
  })
  1.1.0
  Minor Changes
  #94454 4b40eb010074 - Exposing the unsafe overflow auto scroller for external drags (unsafeOverflowAutoScrollForExternal()). This already existed, but it was not exposed publicly 🤦‍♂️.

import {unsafeOverflowAutoScrollForElements from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element';
import {unsafeOverflowAutoScrollForTextSelection} from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/text-selection';

- import {unsafeOverflowAutoScrollForExternal} from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/external';
  1.0.4
  Patch Changes
  #9431635fd5ed8e1d7 - Upgrading internal dependency bind-event-listener to @^3.0.0
  1.0.3
  Patch Changes
  #8439877694db987fc - Public release of Pragmatic drag and drop documentation
  1.0.2
  Patch Changes
  #83702 4d9e25ab4eaa - Updating the descriptions of Pragmatic drag and drop packages, so they each provide a consistent description to various consumers, and so they are consistently formed amongst each other.

package.json description
README.md
Website documentation
1.0.1
Patch Changes
#831168d4e99057fe0 - Upgrade Typescript from 4.9.5 to 5.4.2
1.0.0
Major Changes
#70616 42e57ea65fee - This is our first major release (1.0) for all Pragmatic drag and drop packages.

For a detailed explanation of these changes, and how to upgrade (automatically) to 1.0 please see our 1.0 upgrade guide

Patch Changes
Updated dependencies
0.8.1
Patch Changes
Updated dependencies
0.8.0
Minor Changes
#57337 4ad3fa749a5c - Adding the ability to increase the maximum automatic scroll speed.

autoScrollForElements({
element: myElement,

- getConfiguration: () => ({maxScrollSpeed: 'fast' | 'standard'}),
  })
  getConfiguration() is a new optional argument be used with all auto scrolling registration functions:

autoScrollForElements
autoScrollWindowForElements
autoScrollForFiles
autoScrollWindowForFiles
unsafeOverflowForElements
unsafeOverflowForFiles
autoScrollForElements({
element: myElement,
getConfiguration: () => ({ maxScrollSpeed : 'fast' })
}),
We recommend using the default "standard" max scroll speed for most experiences. However, on some larger experiences, a faster max scroll speed ("fast") can feel better.

0.7.0
Minor Changes
#4277466d9475437e - Internal refactoring to improve clarity and safety
0.6.0
Minor Changes
#42668 0a4e3f44ba3 - We have landed a few fixes for "overflow scrolling"

Fix: Time dampening could be incorrectly reset when transitioning from "over element" auto scrolling to "overflow" auto scrolling for certain element configurations.
Fix: Parent "overflow scrolling" registrations could prevent overflow scrolling on children elements, if the parent was registered first.
Fix: "overflow scrolling" canScroll() => false would incorrectly opt out of "overflow scrolling" for younger registrations.
0.5.0
Minor Changes
#3993520a91012629 - First public release of this package. Please refer to documentation for usage and API information.
Patch Changes
Updated dependencies
0.4.0
Minor Changes
#39303a6d9f3bb566 - Adding optional overflow scrolling API. API information shared directly with Trello
0.3.2
Patch Changes
Updated dependencies
0.3.1
Patch Changes
Updated dependencies
0.3.0
Minor Changes
#386587803a90e9c6 - This change makes it so that distance dampening is based on the size of the hitbox and not the container. Now that we clamp the size of the hitbox, our distance dampening needs to be based on the size of the hitbox, and not the container.
0.2.0
Minor Changes
#386305c643ce004d - Limiting the max size of auto scrolling hitboxes. This prevents large elements having giant auto scroll hitboxes
0.1.0
Minor Changes
#38525693af8c5775 - Early release of our new optional drag and drop package for Pragmatic drag and drop. Package release is only for early integration with Trello.
Patch Changes
Updated dependencies
