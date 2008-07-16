AddRemoveWidget + ComboBoxWidget
	
	by Martin Aspeli <optilude@gmx.net>

This is a replacement for KeywordWidget which permits you to add items from
a vocabulary (and optionally new items) using a pair of selection boxes with
"add" and "remove" buttons to transfer items between them. It overlaps in
functionality with InAndOutWidget, but does not suffer from InAndOut's 
requirement for all items in the "target" list to be selection upon form
submission. I believe InAndOut does not allow textual items to be added
by the user, though it does support adding of referenced objects, which
AddRemove does not. You are advised to test both to find out which one is 
more suitable for your needs.

Please see the docstring in AddRemoveWidget.py for a list of options you
may pass to the widget to configure it.

You can also use the widget standalone, by defining a couple of variables
(notably fieldName and vocabulary) and include the macro add_remove_box from
widget_addremove.pt. See the comment in that file for details.

Also included is a ComboBoxWidget - it can be seen as supporting the same
use case, when only one item may be selected. It presents a selection box
from which to select a value, and a text box to enter an "other" value if
none of the items in the list are sufficient.

Again, see the docstring in ComboBoxWidget.py, and the comment in
widget_combobox.pt for details on how to use it within and outside
Archetypes.