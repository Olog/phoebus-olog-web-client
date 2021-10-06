/**
 * Copyright (C) 2020 European Spallation Source ERIC.
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p>
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */
import moment from 'moment';
import TreeItem from './TreeItem';

test('basicTreeItemTest', () => {
    let ti = new TreeItem();

    let properties1 = [
        {name : "Log Entry Group", attributes : [{name : "id", value : "myLogEntryGroupId"}]}
    ]

    let date1 = moment().toDate();
    let date2 = moment().subtract(1, 'days').toDate();
    let date3 = moment().subtract(2, 'days').toDate();
    let date4 = moment().subtract(3, 'days').toDate();

    let logEntry1 = {id: "1", properties: properties1, createdDate: date1};
    let logEntry2 = {id: "2", properties: properties1, createdDate: date2};
    let logEntry3 = {id: "22", properties: properties1, createdDate: date3};
    let logEntry4 = {id: "23", properties: properties1, createdDate: date4};

    expect(ti.getParent()).toBeNull();
    expect(ti.getChildItems()).toBeNull();

    ti.addLogEntry(logEntry1, false);
    expect(ti.getParent()).toBeDefined();
    expect(ti.getChildItems().length).toBe(0);

    ti.addLogEntry(logEntry2, false);
    ti.addLogEntry(logEntry3, false);
    ti.addLogEntry(logEntry4, false);

    expect(ti.getChildItems().length).toBe(3);
    // Test again to make sure the object still holds the array
    expect(ti.getChildItems().length).toBe(3);

    expect(moment(ti.getParent().createdDate).unix()).toBeGreaterThan(moment(ti.getChildItems()[0].createdDate).unix());
    expect(moment(ti.getChildItems()[0].createdDate).unix()).toBeGreaterThan(moment(ti.getChildItems()[1].createdDate).unix());
    expect(moment(ti.getChildItems()[1].createdDate).unix()).toBeGreaterThan(moment(ti.getChildItems()[2].createdDate).unix());

    expect(ti.get)

});

test('basicTreeItemTestReversedSortOrder', () => {
    let ti = new TreeItem();

    let properties1 = [
        {name : "Log Entry Group", attributes : [{name : "id", value : "myLogEntryGroupId"}]}
    ]

    let date1 = moment().toDate();
    let date2 = moment().subtract(1, 'days').toDate();
    let date3 = moment().subtract(2, 'days').toDate();
    let date4 = moment().subtract(3, 'days').toDate();

    let logEntry1 = {id: "1", properties: properties1, createdDate: date1};
    let logEntry2 = {id: "2", properties: properties1, createdDate: date2};
    let logEntry3 = {id: "22", properties: properties1, createdDate: date3};
    let logEntry4 = {id: "23", properties: properties1, createdDate: date4};

    expect(ti.getParent()).toBeNull();
    expect(ti.getChildItems()).toBeNull();

    ti.addLogEntry(logEntry1, true);
    expect(ti.getParent()).toBeDefined();
    expect(ti.getChildItems().length).toBe(0);

    ti.addLogEntry(logEntry2, true);
    ti.addLogEntry(logEntry3, true);
    ti.addLogEntry(logEntry4, true);

    expect(ti.getChildItems().length).toBe(3);
    // Test again to make sure the object still holds the array
    expect(ti.getChildItems().length).toBe(3);

    expect(moment(ti.getParent().createdDate).unix()).toBeLessThan(moment(ti.getChildItems()[0].createdDate).unix());
    expect(moment(ti.getChildItems()[0].createdDate).unix()).toBeLessThan(moment(ti.getChildItems()[1].createdDate).unix());
    expect(moment(ti.getChildItems()[1].createdDate).unix()).toBeLessThan(moment(ti.getChildItems()[2].createdDate).unix());

    expect(ti.get)

});


test('treeItemTestNoDuplicates', () => {
    let properties1 = [
        {name : "Log Entry Group", attributes : [{name : "id", value : "myLogEntryGroupId"}]}
    ]
    let logEntry1 = {id: "1", properties: properties1};

    let ti = new TreeItem();
    ti.addLogEntry(logEntry1, false);
    ti.addLogEntry(logEntry1, false);

    expect(ti.getParent()).toBeDefined();
    expect(ti.getChildItems().length).toBe(0);

});

test('treeItemNonMatchingLogGroupId', () => {
    let properties1 = [
        {name : "Log Entry Group", attributes : [{name : "id", value : "myLogEntryGroupId"}]}
    ]

    let properties2 = [
        {name : "bad", attributes : [{name : "id", value : "myLogEntryGroupId"}]}
    ]

    let logEntry1 = {id: "1", properties: properties1};
    let logEntry2 = {id: "2", properties: properties2};

    let ti = new TreeItem();
    ti.addLogEntry(logEntry1, false);
    ti.addLogEntry(logEntry2, false); // Will be added as group id does not match.

    expect(ti.getParent()).toBeDefined();
    expect(ti.getChildItems().length).toBe(0);

});

test('treeItemNullParentGroupId', () => {
    let properties1 = [
        {name : "Log Entry Group", attributes : [{name : "id", value : "myLogEntryGroupId"}]}
    ]

    let logEntry1 = {id: "1"};
    let logEntry2 = {id: "2", properties: properties1};

    let ti = new TreeItem();
    ti.addLogEntry(logEntry1, false);
    ti.addLogEntry(logEntry2, false); // Will be added as parent does not define group id.

    expect(ti.getParent()).toBeDefined();
    expect(ti.getChildItems().length).toBe(0);

});
