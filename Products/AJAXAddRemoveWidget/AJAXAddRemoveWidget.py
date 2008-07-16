#
# AJAXAddRemoveWidget by Martin Aspeli <optilude@gmx.net>
#

from Products.Archetypes.Widget import TypesWidget
from Products.Archetypes.Registry import registerWidget
from Products.Archetypes.atapi import DisplayList

from Products.CMFCore.utils import getToolByName

class AJAXAddRemoveWidget(TypesWidget):
    """Widget which presents two boxes, one with possible values, and one
    with selected values, with add/remove buttons to move items between them.
    Intended for use with a LinesField.

    The widget widget_addremove.pt creates two single-select boxes called
    ${fieldName}_selected and ${fieldName}_unselected, and two buttons for
    moving items between them. A hidden field ${fieldName} is maintained by
    the JavaScript functions in widget_addremove.js which are called when
    the add/remove buttons are clicked, which stores the items as a newline-
    separated list. This is the field that's actually submitted, meaning users
    don't have to select all items in the target list in order for them all
    to be submitted.

    If allow_add is 1, a text field with a corresponding 'New' button allows
    users to add new items to the target list. This can be further controlled
    by setting role_based_add to 1 and defining the name of a lines-type 
    property in portal_properties/site_properties giving a list of roles
    which will be allowed to add items, in the same manner as 
    allowRolesToAddKeywords works for the KeywordWidget.
    """

    _properties = TypesWidget._properties.copy()
    _properties.update({    'macro'              : 'widget_addremove',
                            'helper_js'         : ('widget_addremove_vars.js','widget_addremove.js',),
                            
                            # Only some roles can add new items?
                            'role_based_add'    : 0,
                           
                            # Property in site_properties listing which roles
                            #  can add new items
                            'add_role_property' : 'allowRolesToAddKeywords',
                            
                            # Does the keyword vocab come from somewhere other
                            #  than portal_catalog?
                            'vocab_source'      : 'portal_catalog',

                            # Size (num items) and width (measurement) of boxes
                            # Set width_absolute to 1 make width be fixed; else
                            #  it defines the min-width only.
                            'size'              : '7',
                            'width'             : '10em',
                            'width_absolute'    : 0,
                         },)
                         
    def process_form(self, instance, field, form, empty_marker=None,
                     emptyReturnsMarker=False):
        """If a value was typed in the box, use this, else use the selected
        value.
        """
        name = field.getName()
        value = form.get(name, empty_marker)
        if value == '' or value == [''] and emptyReturnsMarker:
            return empty_marker
        return value, {}

    def is_keyword_field(self, field, source):
        """Returns whether or not a given field has a corresponding KeywordIndex
        in the specified catalog (source).
        """
        catalog = getToolByName(self,source)
        idxs = catalog.index_objects()
        filtered = [idx for idx in idxs if idx.id == field.accessor and
                    idx.meta_type == 'KeywordIndex' ]
        return filtered != []
    
    def makeDL(self,list):
        """Takes in a list (of keywords) and returns a display list that
        is expected by the Vocabulary machinery.
        """
        dl = DisplayList()
        for i in list:
            dl.add(i,i)
        return dl

registerWidget(AJAXAddRemoveWidget,
                title = 'Add/Remove widget',
                description= ('Renders a HTML widget with two list boxes and add/remove buttons',),
                used_for = ('Products.Archetypes.Field.LinesField',)
                )
