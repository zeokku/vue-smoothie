# firefox bugs out counting negative offset (translate(-y)) towards scroll height which is incorrect

investigate this further - is it a bug?

# make exposed x,y refs?

`{ x: shallowRef(0), ... }`
`exposed.x.value = ...`

# `__file` exposed in code when `NODE_ENV=development`

# when env var is not set Vite exposes entire `import.meta.env` object instead of replacing the var by undefined

# 2.0

use bezier curves for transition and replace weight by duration

# if sticky is set bottom: 0 and spacer has a width then scroll grow disappears + there is no jump at the end

but there's an extra empty space for some reason

# so the reason behind infinite scroll seem to be lying in incorrect overflow behavior on firefox, when an element translated up it should not accommodate to its scroll height, but on ff it does

the fix seems to be setting sticky wrapper to overflow: hidden to prevent this behavior

# finally firefox bug is fixed!!!

two points:

1. bounce to top at the scroll end was caused by `display flex`!
2. infinite scroll was caused by the child of sticky element as I said before, so setting its height to 0 fixes this, while scrollHeight is correctly calculated

# omfg bounce on firefox is still not fixed

# YES! i finally realized what's up with this fucking bounce on firefox

it's triggered when spacer is smaller (for some fucking reason) than sticky's content, so it bounces to the top at the difference between spacer and content's scroll height

interesting that `display: flex` changes scrollHeight of the sticky element and it's bigger than its contents. this is why flex caused the bounce, because spacer was not enough

# firefox hell

key direction for fixing the infinite scroll bug is to make sticky's child take no space or remove it from the flow.
`height: 0` - is not an option because we need a working resize observer
@todo wait can we just use another wrapper??????????????????????????
`max-height: 0` - is also not an option, even though with this resize observer works, scroll height is always wrong at the initial rendering. i have no idea why and there's no option to set it to a proper height
@todo try to set it on scroll?????????????????????????????????????
`position: absolute` - promising option and regular flavor works great for vertical scroll but omni becomes broken for this one due to `width: 0` for sticky to prevent filling additional horizontal space
it is possible to just add a prop prolly to set horizontal scroll
