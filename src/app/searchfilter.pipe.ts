import { Pipe, PipeTransform } from '@angular/core';
import { User } from './components/users/users.component';
@Pipe({
  name: 'searchfilter'
})
export class SearchfilterPipe implements PipeTransform {

  transform(users: User[], searchValue: string): User[] {
    if (!users || !searchValue) {
      return users;
    }
    return users.filter(
      user => user.FirstName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
        user.LastName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
  }
}
